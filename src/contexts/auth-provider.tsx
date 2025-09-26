'use client'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { usePathname, useRouter } from 'next/navigation'
import Loader from '@/components/shared/loader'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  )
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const publicAuthRoutes = ['/login', '/register', '/forgot-password']

    if (publicAuthRoutes.includes(pathname)) {
      router.push('/analytics')
    }
  }, [isAuthenticated, user, pathname, router, isLoading])

  if (isLoading) {
    return <Loader />
  }

  return <>{children}</>
}
