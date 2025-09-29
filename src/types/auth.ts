export type UserRole = string

export interface UserProfile {
  id: string
  user_id: string
  email: string
  username: string
  full_name: string
  first_name: string
  last_name: string
  phone: string
  avatar?: string | null
  user_type: 'guest' | 'admin' | '' | string
  otp_required: boolean
  is_email_verified: boolean
  is_active: boolean
  is_locked: boolean
  password_changed_at: string | null
  last_login_at: string | null
  failed_login_attempts: number
  roles: string[]
  entity_id: string | null

  created_at: string
  updated_at: string
  created_by_id: string | null
  updated_by_id: string | null
  audit_comment: string | null
  is_deleted: boolean
  deleted_at: string | null
  deleted_by_id: string | null
  version: number
}

export interface AuthState {
  user: {
    phone_number: string
    email: string
    id: string
    role: string
  } | null
  access_token: string | null
  refresh_token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

export interface LoginCredentials {
  phone_number: string
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  password1: string
  password2: string
}

export interface AuthResponse {
  phone_number: string
  email: string
  access: string
  refresh: string
  id: string
  role: string
}

export interface TokenPayload {
  sub: string // user id
  email: string
  role: UserRole
  iat: number // issued at
  exp: number // expiration
  jti: string // JWT ID (unique identifier)
}

export interface Session {
  user: UserProfile
  expires: string
}

export interface ProtectedRouteConfig {
  roles?: UserRole[]
  redirectTo?: string
  fallback?: React.ReactNode
}
