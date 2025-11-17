import {
  Middleware,
  isRejectedWithValue,
  isFulfilled,
  isPending,
  createAction,
} from '@reduxjs/toolkit'
import { clearAuthState, updateTokens } from '@/store/slices/auth-slice'
import { AppDispatch, RootState } from '@/store/store'
import { toast } from 'sonner'
import { refreshToken } from '@/store/actions/auth'

const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY_MS = 1000
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000
const CONCURRENT_REQUESTS_LIMIT = 5

const MAX_CONSECUTIVE_REFRESH_ATTEMPTS = 2
const REFRESH_COOLDOWN_PERIOD_MS = 30 * 1000
const GLOBAL_TIMEOUT_MS = 5 * 60 * 1000
const REQUEST_DEBOUNCE_MS = 1000

interface FailedRequest {
  action: any
  resolve: (value?: any) => void
  reject: (reason?: any) => void
  retryCount: number
  timestamp: number
}

interface AuthMiddlewareState {
  isRefreshing: boolean
  refreshPromise: Promise<any> | null
  failedRequests: FailedRequest[]
  retryQueue: Map<string, { count: number; lastAttempt: number }>
  concurrentRequests: number
  lastTokenRefresh: number | null

  consecutiveRefreshAttempts: number
  lastRefreshAttempt: number | null
  middlewareStartTime: number
  isInSafeState: boolean
  refreshCooldownUntil: number | null
  pendingActions: Map<string, number>
  circuitBreaker: {
    isOpen: boolean
    openedAt: number | null
    failureCount: number
  }
}

export const queueRequest = createAction<FailedRequest>(
  'authMiddleware/queueRequest'
)
export const retryQueuedRequests = createAction(
  'authMiddleware/retryQueuedRequests'
)
export const clearQueuedRequests = createAction(
  'authMiddleware/clearQueuedRequests'
)

class AuthMiddlewareManager {
  private state: AuthMiddlewareState = {
    isRefreshing: false,
    refreshPromise: null,
    failedRequests: [],
    retryQueue: new Map(),
    concurrentRequests: 0,
    lastTokenRefresh: null,

    consecutiveRefreshAttempts: 0,
    lastRefreshAttempt: null,
    middlewareStartTime: Date.now(),
    isInSafeState: true,
    refreshCooldownUntil: null,
    pendingActions: new Map(),
    circuitBreaker: {
      isOpen: false,
      openedAt: null,
      failureCount: 0,
    },
  }

  private checkGlobalTimeout(): boolean {
    const elapsed = Date.now() - this.state.middlewareStartTime
    if (elapsed > GLOBAL_TIMEOUT_MS) {
      console.log('Auth middleware global timeout reached. Resetting state.')
      this.enterSafeState()
      return true
    }
    return false
  }

  private checkCircuitBreaker(): boolean {
    const { circuitBreaker } = this.state

    if (circuitBreaker.isOpen) {
      if (
        circuitBreaker.openedAt &&
        Date.now() - circuitBreaker.openedAt > REFRESH_COOLDOWN_PERIOD_MS
      ) {
        console.warn('Circuit breaker half-open - allowing one request through')
        circuitBreaker.isOpen = false
        circuitBreaker.failureCount = 0
        return false
      }
      return true
    }

    return false
  }

  private tripCircuitBreaker(): void {
    this.state.circuitBreaker = {
      isOpen: true,
      openedAt: Date.now(),
      failureCount: this.state.circuitBreaker.failureCount + 1,
    }

    console.log(
      `Circuit breaker tripped. Failure count: ${this.state.circuitBreaker.failureCount}`
    )

    if (this.state.circuitBreaker.failureCount >= 3) {
      this.enterSafeState()
    }
  }

  private enterSafeState(): void {
    this.state.isInSafeState = true
    this.state.isRefreshing = false
    this.state.refreshPromise = null
    this.state.consecutiveRefreshAttempts = 0
    this.state.circuitBreaker.isOpen = false
    this.clearFailedRequests()

    console.warn(
      'Auth middleware entered safe state. Manual intervention may be required.'
    )
  }

  private exitSafeState(): void {
    this.state.isInSafeState = false
    this.state.consecutiveRefreshAttempts = 0
    this.state.circuitBreaker.failureCount = 0
    this.state.refreshCooldownUntil = null
  }

  private canAttemptRefresh(): boolean {
    if (this.state.isInSafeState) {
      console.warn('Refresh attempt blocked: Middleware is in safe state')
      return false
    }

    if (this.checkCircuitBreaker()) {
      console.warn('Refresh attempt blocked: Circuit breaker is open')
      return false
    }

    if (
      this.state.refreshCooldownUntil &&
      Date.now() < this.state.refreshCooldownUntil
    ) {
      console.warn('Refresh attempt blocked: Cooldown period active')
      return false
    }

    if (
      this.state.consecutiveRefreshAttempts >= MAX_CONSECUTIVE_REFRESH_ATTEMPTS
    ) {
      console.log(
        `Refresh attempt blocked: Too many consecutive attempts (${this.state.consecutiveRefreshAttempts})`
      )
      this.tripCircuitBreaker()
      return false
    }

    return true
  }

  private recordRefreshAttempt(success: boolean): void {
    this.state.lastRefreshAttempt = Date.now()

    if (success) {
      this.state.consecutiveRefreshAttempts = 0
      this.state.refreshCooldownUntil = null
      this.state.circuitBreaker.failureCount = 0
    } else {
      this.state.consecutiveRefreshAttempts++
      this.state.refreshCooldownUntil = Date.now() + REFRESH_COOLDOWN_PERIOD_MS

      if (
        this.state.consecutiveRefreshAttempts >=
        MAX_CONSECUTIVE_REFRESH_ATTEMPTS
      ) {
        this.tripCircuitBreaker()
      }
    }
  }

  private debounceAction(action: any): boolean {
    const actionKey = action.type + JSON.stringify(action.payload || {})
    const now = Date.now()
    const lastAttempt = this.state.pendingActions.get(actionKey)

    if (lastAttempt && now - lastAttempt < REQUEST_DEBOUNCE_MS) {
      console.warn('Action debounced: Too many similar requests in short time')
      return true
    }

    this.state.pendingActions.set(actionKey, now)

    if (this.state.pendingActions.size > 100) {
      const cutoff = now - REQUEST_DEBOUNCE_MS * 10
      for (const [key, timestamp] of this.state.pendingActions.entries()) {
        if (timestamp < cutoff) {
          this.state.pendingActions.delete(key)
        }
      }
    }

    return false
  }

  shouldRefreshToken(state: RootState): boolean {
    if (!this.canAttemptRefresh()) {
      return false
    }

    const auth = state.auth
    if (!auth.access_token || !auth.expires_at) return false

    const expiresAt = new Date(auth.expires_at).getTime()
    const now = Date.now()
    const timeUntilExpiry = expiresAt - now

    return timeUntilExpiry < TOKEN_REFRESH_BUFFER_MS && !this.state.isRefreshing
  }

  isTokenExpired(state: RootState): boolean {
    const auth = state.auth
    if (!auth.access_token || !auth.expires_at) return true

    const expiresAt = new Date(auth.expires_at).getTime()
    return Date.now() >= expiresAt
  }

  addFailedRequest(request: FailedRequest): void {
    this.state.failedRequests.push(request)
  }

  clearFailedRequests(): void {
    this.state.failedRequests = []
  }

  retryFailedRequests(store: any): void {
    const requests = [...this.state.failedRequests]
    this.clearFailedRequests()

    requests.forEach(({ action, resolve, reject }) => {
      store.dispatch(action).then(resolve).catch(reject)
    })
  }

  shouldRetryRequest(actionType: string, error: any): boolean {
    if (this.state.isInSafeState || this.checkCircuitBreaker()) {
      return false
    }

    const now = Date.now()
    const retryInfo = this.state.retryQueue.get(actionType)

    if (this.isAuthError(error)) return false

    if (this.isClientError(error) && !this.isRetriableClientError(error))
      return false

    if (!retryInfo) {
      this.state.retryQueue.set(actionType, { count: 1, lastAttempt: now })
      return true
    }

    const timeSinceLastAttempt = now - retryInfo.lastAttempt
    const backoffDelay = Math.min(
      RETRY_DELAY_MS * Math.pow(2, retryInfo.count - 1),
      30000
    )

    if (
      retryInfo.count >= MAX_RETRY_ATTEMPTS ||
      timeSinceLastAttempt < backoffDelay
    ) {
      return false
    }

    this.state.retryQueue.set(actionType, {
      count: retryInfo.count + 1,
      lastAttempt: now,
    })

    return true
  }

  clearRetryQueue(): void {
    this.state.retryQueue.clear()
  }

  isAuthError(error: any): boolean {
    const status: any = this.getErrorStatus(error)
    return status === 401 || status === 403
  }

  isServerError(error: any): boolean {
    const status: any = this.getErrorStatus(error)
    return status >= 500 && status < 600
  }

  isClientError(error: any): boolean {
    const status: any = this.getErrorStatus(error)
    return status >= 400 && status < 500
  }

  isRetriableClientError(error: any): boolean {
    const status: any = this.getErrorStatus(error)
    return status === 408 || status === 429
  }

  isNetworkError(error: any): boolean {
    return (
      !error?.status && !error?.originalStatus && navigator.onLine === false
    )
  }

  getErrorStatus(error: any): number | null {
    return (
      error?.status ||
      error?.status_code ||
      error?.originalStatus ||
      error?.response?.status ||
      (typeof error === 'object' && 'status' in error ? error.status : null)
    )
  }

  canMakeRequest(): boolean {
    if (this.state.isInSafeState || this.checkCircuitBreaker()) {
      return false
    }
    return this.state.concurrentRequests < CONCURRENT_REQUESTS_LIMIT
  }

  incrementConcurrentRequests(): void {
    this.state.concurrentRequests++
  }

  decrementConcurrentRequests(): void {
    this.state.concurrentRequests = Math.max(
      0,
      this.state.concurrentRequests - 1
    )
  }

  setRefreshing(
    refreshing: boolean,
    promise: Promise<any> | null = null
  ): void {
    this.state.isRefreshing = refreshing
    this.state.refreshPromise = promise
  }

  getRefreshPromise(): Promise<any> | null {
    return this.state.refreshPromise
  }

  setLastTokenRefresh(timestamp: number): void {
    this.state.lastTokenRefresh = timestamp
  }

  resetMiddleware(): void {
    console.warn('Manual middleware reset triggered')
    this.state = {
      ...this.state,
      isRefreshing: false,
      refreshPromise: null,
      failedRequests: [],
      consecutiveRefreshAttempts: 0,
      refreshCooldownUntil: null,
      circuitBreaker: {
        isOpen: false,
        openedAt: null,
        failureCount: 0,
      },
    }
  }

  forceSafeState(): void {
    this.enterSafeState()
  }

  recoverFromSafeState(): void {
    this.exitSafeState()
  }
}

const authMiddlewareManager: any = new AuthMiddlewareManager()

export const authMiddleware: Middleware<{}, RootState, AppDispatch> =
  store => next => async action => {
    if (authMiddlewareManager.checkGlobalTimeout()) {
      return next(action)
    }

    const state = store.getState()
    const dispatch = store.dispatch as AppDispatch

    if (authMiddlewareManager.debounceAction(action)) {
      return next(action)
    }

    if (isPending(action)) {
      if (!authMiddlewareManager.canMakeRequest()) {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject('Request timeout: Too many concurrent requests')
          }, 30000)

          authMiddlewareManager.addFailedRequest({
            action,
            resolve: (value: any) => {
              clearTimeout(timeoutId)
              resolve(value)
            },
            reject: (error: any) => {
              clearTimeout(timeoutId)
              reject(error)
            },
            retryCount: 0,
            timestamp: Date.now(),
          })
        })
      }

      authMiddlewareManager.incrementConcurrentRequests()
    }

    if (isFulfilled(action)) {
      authMiddlewareManager.decrementConcurrentRequests()
      authMiddlewareManager.clearRetryQueue()
    }

    if (isRejectedWithValue(action)) {
      authMiddlewareManager.decrementConcurrentRequests()

      const { payload, meta }: any = action
      const error = payload || action.error

      if (authMiddlewareManager.isNetworkError(error)) {
        toast.error('Network Error', {
          description: 'Please check your internet connection and try again.',
        })

        if (
          authMiddlewareManager.shouldRetryRequest(
            meta?.arg?.type || action.type,
            error
          )
        ) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              store.dispatch(action).then(resolve).catch(reject)
            }, RETRY_DELAY_MS)
          })
        }
      }

      if (authMiddlewareManager.isAuthError(error)) {
        console.warn('Authentication error detected:', {
          actionType: action.type,
          error: error,
          isRefreshing: authMiddlewareManager.getRefreshPromise(),
          consecutiveAttempts:
            authMiddlewareManager.state.consecutiveRefreshAttempts,
        })

        if (!authMiddlewareManager.canAttemptRefresh()) {
          console.log('Refresh blocked by fail-safe mechanisms')
          dispatch(clearAuthState())
          return next(action)
        }

        if (authMiddlewareManager.getRefreshPromise()) {
          return new Promise((resolve, reject) => {
            authMiddlewareManager.addFailedRequest({
              action,
              resolve,
              reject,
              retryCount: 0,
              timestamp: Date.now(),
            })
          })
        }

        if (
          state.auth.refresh_token &&
          !authMiddlewareManager.getRefreshPromise()
        ) {
          try {
            authMiddlewareManager.setRefreshing(true)

            const refreshPromise = dispatch(
              refreshToken({
                refresh_token: state.auth.refresh_token,
              })
            ).unwrap()

            authMiddlewareManager.setRefreshing(true, refreshPromise)

            const result = await refreshPromise

            authMiddlewareManager.setRefreshing(false, null)
            authMiddlewareManager.setLastTokenRefresh(Date.now())
            authMiddlewareManager.recordRefreshAttempt(true)

            console.log('Token refresh successful')

            dispatch(
              updateTokens({
                access_token: result.access_token,
                refresh_token: result.refresh_token,
                expires_at: result.expires_at,
              })
            )

            authMiddlewareManager.retryFailedRequests(store)

            return store.dispatch(action)
          } catch (refreshError) {
            authMiddlewareManager.setRefreshing(false, null)
            authMiddlewareManager.recordRefreshAttempt(false)

            console.log('Token refresh failed:', refreshError)

            if (
              authMiddlewareManager.state.consecutiveRefreshAttempts >=
              MAX_CONSECUTIVE_REFRESH_ATTEMPTS
            ) {
              toast.error('Authentication Error', {
                description: 'Unable to refresh session. Please log in again.',
              })
            } else {
              toast.error('Session Expired', {
                description: 'Your session has expired. Please log in again.',
              })
            }

            dispatch(clearAuthState())
            authMiddlewareManager.clearFailedRequests()

            if (
              typeof window !== 'undefined' &&
              !window.location.pathname.includes('/login')
            ) {
              const returnUrl = encodeURIComponent(
                window.location.pathname + window.location.search
              )
              window.location.href = `/login?returnUrl=${returnUrl}`
            }

            return next(action)
          }
        } else {
          dispatch(clearAuthState())

          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.includes('/login')
          ) {
            window.location.href = '/login'
          }
        }
      }

      if (authMiddlewareManager.isServerError(error)) {
        console.log('Server error:', error)
        if (
          authMiddlewareManager.shouldRetryRequest(
            meta?.arg?.type || action.type,
            error
          )
        ) {
          return new Promise((resolve, reject) => {
            const retryInfo = authMiddlewareManager.state.retryQueue.get(
              meta?.arg?.type || action.type
            )
            const retryCount = retryInfo?.count || 1
            const delay = RETRY_DELAY_MS * Math.pow(2, retryCount - 1)

            setTimeout(() => {
              store.dispatch(action).then(resolve).catch(reject)
            }, delay)
          })
        } else {
          toast.error('Server Error', {
            description:
              'The server is experiencing issues. Please try again later.',
          })
        }
      }

      if (authMiddlewareManager.getErrorStatus(error) === 429) {
        toast.info('Too Many Requests', {
          description: 'Please wait a moment before trying again.',
        })

        if (
          authMiddlewareManager.shouldRetryRequest(
            meta?.arg?.type || action.type,
            error
          )
        ) {
          const retryAfter =
            error?.retry_after || error?.headers?.['retry-after'] || 60
          const delay = Math.min(parseInt(retryAfter) * 1000, 30000)
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              store.dispatch(action).then(resolve).catch(reject)
            }, delay)
          })
        }
      }
    }

    if (isPending(action) && authMiddlewareManager.shouldRefreshToken(state)) {
      try {
        authMiddlewareManager.setRefreshing(true)
        const refreshPromise = dispatch(
          refreshToken({
            refresh_token: state.auth.refresh_token,
          })
        ).unwrap()
        authMiddlewareManager.setRefreshing(true, refreshPromise)
        await refreshPromise
        authMiddlewareManager.setRefreshing(false, null)
        authMiddlewareManager.setLastTokenRefresh(Date.now())
        authMiddlewareManager.recordRefreshAttempt(true)
      } catch (error) {
        authMiddlewareManager.setRefreshing(false, null)
        authMiddlewareManager.recordRefreshAttempt(false)
        console.warn('Proactive token refresh failed:', error)
      }
    }
    return next(action)
  }

export const isAuthMiddlewareActive = (): boolean => {
  return authMiddlewareManager !== undefined
}

export const getAuthMiddlewareStats = () => ({
  isRefreshing: authMiddlewareManager.state.isRefreshing,
  queuedRequests: authMiddlewareManager.state.failedRequests.length,
  concurrentRequests: authMiddlewareManager.state.concurrentRequests,
  retryQueueSize: authMiddlewareManager.state.retryQueue.size,
  lastTokenRefresh: authMiddlewareManager.state.lastTokenRefresh,
  consecutiveRefreshAttempts:
    authMiddlewareManager.state.consecutiveRefreshAttempts,
  isInSafeState: authMiddlewareManager.state.isInSafeState,
  circuitBreaker: authMiddlewareManager.state.circuitBreaker,
  refreshCooldownUntil: authMiddlewareManager.state.refreshCooldownUntil,
})

export const resetAuthMiddleware = (): void => {
  authMiddlewareManager.resetMiddleware()
}

export const forceAuthMiddlewareSafeState = (): void => {
  authMiddlewareManager.forceSafeState()
}

export const recoverAuthMiddleware = (): void => {
  authMiddlewareManager.recoverFromSafeState()
}

export { AuthMiddlewareManager }
