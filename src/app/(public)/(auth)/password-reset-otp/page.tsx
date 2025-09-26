import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const PasswordResetOtpView = dynamic(() => import('@/features/auth/password-reset-otp/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const PasswordResetOtpPage = () => {
  return <PasswordResetOtpView />
}

export default PasswordResetOtpPage
