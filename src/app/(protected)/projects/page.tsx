'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getAllProjects } from '@/store/actions/project'
import { selectProjects } from '@/store/selectors/project'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Sprout, Beef } from 'lucide-react'

const ProjectsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { projects, isLoading, error } = useAppSelector(selectProjects)

  useEffect(() => {
    dispatch(getAllProjects())
  }, [dispatch])

  const handleCreateProject = useCallback(() => {
    router.push('/plant-farming')
  }, [router])

  const handleProjectClick = useCallback(
    (projectId: string) => {
      router.push(`/project/${projectId}`)
    },
    [router]
  )

  const projectCards = useMemo(() => {
    return projects.results.map((project) => (
      <Card
        key={project.id}
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => handleProjectClick(project.id)}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {project.animal_group ? (
                <Beef className="h-5 w-5" />
              ) : (
                <Sprout className="h-5 w-5" />
              )}
              {project.name}
            </CardTitle>
            <span
              className={`px-2 py-1 rounded text-xs ${
                project.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : project.status === 'Planning'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {project.status}
            </span>
          </div>
          <CardDescription>
            {project.location.city}, {project.location.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Created: {new Date(project.created_date).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    ))
  }, [projects, handleProjectClick])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-destructive">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No projects yet</p>
          <Button onClick={handleCreateProject}>
            Create Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectCards}
        </div>
      )}
    </div>
  )
}

export default ProjectsPage
