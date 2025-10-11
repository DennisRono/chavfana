import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const ProjectView = dynamic(() => import('@/features/project/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const projectId = params.id
  return <ProjectView projectId={projectId} />
}

export default ProjectPage
