import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const ProjectView = dynamic(() => import('@/features/project/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const ProjectPage = () => {
  return <ProjectView projectId="wheat-field-a" />
}

export default ProjectPage
