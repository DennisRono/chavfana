import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const VerifyPhoneView = dynamic(() => import('@/features/auth/verify-phone/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const VerifyPhonePage = () => {
  return <VerifyPhoneView />
}

export default VerifyPhonePage
