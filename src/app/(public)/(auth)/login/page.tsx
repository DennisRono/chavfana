import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const LoginView = dynamic(() => import('@/features/auth/login/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const LoginPage = () => {
  return <LoginView />
}

export default LoginPage
