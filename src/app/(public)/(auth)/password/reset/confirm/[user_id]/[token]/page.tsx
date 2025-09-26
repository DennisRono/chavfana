import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const ResetConfirmView = dynamic(() => import('@/features/auth/reset-confirm/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const ResetConfirmPage = () => {
  return <ResetConfirmView />
}

export default ResetConfirmPage
