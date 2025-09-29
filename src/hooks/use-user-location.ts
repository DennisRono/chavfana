'use client'

import { useState, useEffect, useCallback } from 'react'

interface Coordinates {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

interface LocationError {
  code: number
  message: string
}

type PermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported'

interface UseUserLocationReturn {
  coordinates: Coordinates | null
  error: LocationError | null
  permissionState: PermissionState
  isLoading: boolean
  requestLocation: () => void
}

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes cache
}

export function useUserLocation(): UseUserLocationReturn {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [error, setError] = useState<LocationError | null>(null)
  const [permissionState, setPermissionState] =
    useState<PermissionState>('prompt')
  const [isLoading, setIsLoading] = useState(false)

  const checkPermissionState =
    useCallback(async (): Promise<PermissionState> => {
      if (!navigator.permissions || !navigator.geolocation) {
        return 'unsupported'
      }

      try {
        const permission = await navigator.permissions.query({
          name: 'geolocation',
        })
        return permission.state as PermissionState
      } catch {
        return 'prompt'
      }
    }, [])

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        GEOLOCATION_OPTIONS
      )
    })
  }, [])

  const requestLocation = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const permission = await checkPermissionState()
      setPermissionState(permission)

      if (permission === 'unsupported') {
        throw new Error('Geolocation is not supported by this browser')
      }

      if (permission === 'denied') {
        throw new Error(
          'Location access denied. Please enable location access in your browser settings.'
        )
      }

      const position = await getCurrentPosition()

      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      })

      setPermissionState('granted')
    } catch (err) {
      const geolocationError = err as GeolocationPositionError

      let errorMessage: string
      switch (geolocationError.code) {
        case 1: // PERMISSION_DENIED
          errorMessage =
            'Location access denied. Please enable location access in your browser settings.'
          setPermissionState('denied')
          break
        case 2: // POSITION_UNAVAILABLE
          errorMessage = 'Location information is unavailable.'
          break
        case 3: // TIMEOUT
          errorMessage = 'Location request timed out.'
          break
        default:
          errorMessage =
            geolocationError.message ||
            'An unknown error occurred while retrieving location.'
      }

      setError({
        code: geolocationError.code || 0,
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }, [checkPermissionState, getCurrentPosition])

  useEffect(() => {
    let mounted = true

    const initializePermissionState = async () => {
      const permission = await checkPermissionState()
      if (mounted) {
        setPermissionState(permission)

        // Auto-request if already granted
        if (permission === 'granted') {
          requestLocation()
        }
      }
    }

    initializePermissionState()

    return () => {
      mounted = false
    }
  }, [checkPermissionState, requestLocation])

  return {
    coordinates,
    error,
    permissionState,
    isLoading,
    requestLocation,
  }
}
