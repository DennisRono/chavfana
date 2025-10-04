'use client'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { usePathname, useRouter } from 'next/navigation'
import Loader from '@/components/shared/loader'
import { useAppDispatch } from '@/store/hooks'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  )
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {}, [])

  useEffect(() => {
    if (!isAuthenticated || !user) return
  }, [isAuthenticated, user, pathname, router, isLoading])

  if (isLoading) {
    return <Loader />
  }

  return <>{children}</>
}
