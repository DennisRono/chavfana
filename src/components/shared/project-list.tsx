'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, MapPin, Wheat, Beef, Eye } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { updateLastTime } from '@/utils/functions'
import Link from 'next/link'
import { useAppDispatch } from '@/store/hooks'
import { getAllProjects, searchProjects } from '@/store/actions/project'
import { debounce } from 'lodash'
import { ProjectResponse } from '@/types/project'

interface ProjectsListProps {
  searchQuery?: string
  apiProjects: {
    count: number
    next: string | null
    previous: string | null
    results: ProjectResponse[]
    total_active_projects: number
    total_animals: number
    total_land_under_cultivation: number
    last_month_total_animal: number
    last_month_total_planted_area: number
    last_month_created_project: number
    current_month_total_animal: number
    current_month_total_planted_area: number
    current_month_created_project: number
  }
  isLoading: boolean
  error: any
}

const ProjectsList = ({
  searchQuery = '',
  apiProjects,
  isLoading,
  error,
}: ProjectsListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useAppDispatch()

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      dispatch(searchProjects(term))
    }, 500),
    [dispatch]
  )

  useEffect(() => {
    if (searchTerm?.trim()) {
      debouncedSearch(searchTerm)
    }
    return () => {
      debouncedSearch.cancel()
    }
  }, [searchTerm, debouncedSearch])

  useEffect(() => {
    dispatch(getAllProjects())
  }, [dispatch])

  const activeSearchTerm = searchQuery || searchTerm
  const filteredProjects =
    apiProjects?.results?.filter(
      (project: any) =>
        project.name.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        project.location?.city
          ?.toLowerCase()
          .includes(activeSearchTerm.toLowerCase())
    ) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'Completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="p-4">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Farm Projects</CardTitle>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery || searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <p className="text-muted-foreground">Loading projects...</p>
        )}
        {error && (
          <p className="text-red-500">Failed to load projects from API.</p>
        )}

        {!isLoading && filteredProjects.length > 0 ? (
          filteredProjects.map((project: any) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-lg">
                  {project.type === 'PlantingProject' ? (
                    <Wheat className="h-5 w-5 text-green-600" />
                  ) : (
                    <Beef className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{project.location?.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{updateLastTime(project.created_at)}</span>
                    </div>
                    <span>
                      {project.type === 'PlantingProject'
                        ? project.total_area_size + ' acres'
                        : project.total_project_animal + ' animals'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Link href={`/project/${project.slug}`} className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    <span>View Details</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : !isLoading ? (
          <p className="text-muted-foreground">You have no ongoing projects</p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default ProjectsList
