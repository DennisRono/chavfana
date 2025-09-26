'use client'
// import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthProvider from '@/contexts/auth-provider'
import Loader from '@/components/shared/loader'
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isAuthenticated, isLoading } = {
    isAuthenticated: true,
    isLoading: false,
  }
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.replace('/login')
    }
  }, [isLoading])

  if (isLoading) {
    return <Loader />
  }

  return (
    <AuthProvider>
      <Header />
      {children}
      <Footer />
    </AuthProvider>
  )
}
