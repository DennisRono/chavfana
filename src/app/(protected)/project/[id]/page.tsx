import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/shared/loader'

const ProjectView = dynamic(() => import('@/features/project/index'), {
  ssr: true,
  loading: () => <Loader />,
})

const ProjectPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <ProjectView projectId={id} />
}

export default ProjectPage
