import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const VerifyEmailView = dynamic(() => import('@/features/auth/verify-email/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const VerifyEmailPage = () => {
  return <VerifyEmailView />
}

export default VerifyEmailPage
