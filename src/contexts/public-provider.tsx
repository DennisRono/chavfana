'use client'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Loader from '@/components/shared/loader'
import { selectAuth } from '@/store/selectors/auth'

interface PublicProviderProps {
  children: React.ReactNode
}

export default function PublicProvider({ children }: PublicProviderProps) {
  const { isAuthenticated, user, isLoading } = useSelector(selectAuth)
  const router = useRouter()
  
  useEffect(() => {
    if (isAuthenticated || user) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router, isLoading])

  if (isLoading) {
    return <Loader />
  }

  return <>{children}</>
}
