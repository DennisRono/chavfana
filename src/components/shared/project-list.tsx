'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Search,
  Calendar,
  MapPin,
  Wheat,
  Beef,
  Eye,
  Star,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { updateLastTime } from '@/utils/functions'
import Link from 'next/link'
import { useAppDispatch } from '@/store/hooks'
import type { ProjectResponse } from '@/types/project'
import { useSelector } from 'react-redux'
import { selectSearch } from '@/store/selectors/search'

interface ProjectsListProps {
  scrollRef: any
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

type SortOption = 'name' | 'date' | 'status'

const ProjectsList = ({
  scrollRef,
  apiProjects,
  isLoading,
  error,
}: ProjectsListProps) => {
  const { search_term } = useSelector(selectSearch)
  const dispatch = useAppDispatch()

  const [sortBy, setSortBy] = useState<SortOption>('date')
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const itemsPerPage = 12

  const processedProjects = useMemo(() => {
    const filtered =
      apiProjects?.results?.filter(
        (project: any) =>
          project.name.toLowerCase().includes(search_term.toLowerCase()) ||
          project.location?.city
            ?.toLowerCase()
            .includes(search_term.toLowerCase())
      ) || []

    const favoriteProjects = filtered.filter((p: any) => favorites.has(p.id))
    const regularProjects = filtered.filter((p: any) => !favorites.has(p.id))

    const sortProjects = (projects: any[]) => {
      return [...projects].sort((a: any, b: any) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'status':
            return a.status.localeCompare(b.status)
          case 'date':
          default:
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            )
        }
      })
    }

    return [...sortProjects(favoriteProjects), ...sortProjects(regularProjects)]
  }, [apiProjects?.results, search_term, sortBy, favorites])

  const paginatedProjects = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    return processedProjects.slice(startIdx, endIdx)
  }, [processedProjects, currentPage])

  const totalPages = Math.ceil(processedProjects.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const toggleFavorite = (projectId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(projectId)) {
        newFavorites.delete(projectId)
      } else {
        newFavorites.add(projectId)
      }
      return newFavorites
    })
    setCurrentPage(1)
  }

  return (
    <div
      className="w-full space-y-6 scroll-mt-20"
      ref={scrollRef}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Farm Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {processedProjects.length} project
              {processedProjects.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as SortOption)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="status">Sort by Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">
              Failed to load projects
            </p>
            <p className="text-sm text-destructive/80">
              There was an error loading projects from the API. Please try
              again.
            </p>
          </div>
        </div>
      )}

      {!isLoading && !error && processedProjects.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedProjects.map((project: any) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFavorite(project.id)}
                  className="absolute right-3 top-3 rounded-full p-2 transition-colors hover:bg-muted"
                  aria-label={
                    favorites.has(project.id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                >
                  <Star
                    className={`h-5 w-5 transition-colors ${
                      favorites.has(project.id)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground hover:text-yellow-400'
                    }`}
                  />
                </button>

                <div className="mb-3 flex items-start gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    {project.type === 'PlantingProject' ? (
                      <Wheat className="h-5 w-5 text-green-600" />
                    ) : (
                      <Beef className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 pr-6">
                    <h3 className="font-semibold leading-tight text-card-foreground">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {project.type === 'PlantingProject'
                        ? 'Planting Project'
                        : 'Livestock Project'}
                    </p>
                  </div>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {project.location?.city || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>{updateLastTime(project.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {project.type === 'PlantingProject' ? (
                      <>
                        <Wheat className="h-4 w-4 flex-shrink-0" />
                        <span>{project.total_area_size} acres</span>
                      </>
                    ) : (
                      <>
                        <Beef className="h-4 w-4 flex-shrink-0" />
                        <span>{project.total_project_animal} animals</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>

                <Link href={`/project/${project.id}`} className="block">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full transition-colors hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • Showing{' '}
                {Math.min(
                  itemsPerPage,
                  processedProjects.length - (currentPage - 1) * itemsPerPage
                )}{' '}
                of {processedProjects.length} projects
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)

                      if (!showPage && page !== 2 && page !== totalPages - 1) {
                        return null
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(page)
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : !isLoading && !error ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <Wheat className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-semibold">No projects found</h3>
          <p className="text-sm text-muted-foreground">
            {search_term
              ? `No projects match "${search_term}". Try adjusting your search.`
              : 'You have no ongoing projects yet. Create one to get started!'}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default ProjectsList
