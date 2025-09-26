import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const DashboardView = dynamic(() => import('@/features/dashboard/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const DashboardPage = () => {
  return <DashboardView />
}

export default DashboardPage
