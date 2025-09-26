import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const ForgotPasswordView = dynamic(() => import('@/features/auth/forgot-password/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const ForgotPasswordPage = () => {
  return <ForgotPasswordView />
}

export default ForgotPasswordPage
