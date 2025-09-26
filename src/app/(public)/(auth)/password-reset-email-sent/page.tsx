import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const PasswordResetEmailView = dynamic(() => import('@/features/auth/password-reset-email/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const PasswordResetEmailPage = () => {
  return <PasswordResetEmailView />
}

export default PasswordResetEmailPage
