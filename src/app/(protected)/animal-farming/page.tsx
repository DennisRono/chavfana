import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const AnimalFarmingView = dynamic(() => import('@/features/animal-farming/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const AnimalFarmingPage = () => {
  return <AnimalFarmingView />
}

export default AnimalFarmingPage
