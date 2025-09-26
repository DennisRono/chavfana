import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const PlantFarmingView = dynamic(() => import('@/features/plant-farming/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const PlantFarmingPage = () => {
  return <PlantFarmingView />
}

export default PlantFarmingPage
