"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Sprout, Beef, Edit } from "lucide-react"
import type { ProjectResponse } from "@/types/project"

interface ProjectHeaderProps {
  project: ProjectResponse
  onEditClick: () => void
}

export function ProjectHeader({ project, onEditClick }: ProjectHeaderProps) {
  const isAnimalProject = useMemo(() => project.type === "AnimalKeepingProject", [project.type])
  const projectType = useMemo(() => (isAnimalProject ? "Animal Farming" : "Plant Farming"), [isAnimalProject])

  return (
    <div className="bg-card mx-6 mt-2 rounded-md">
      <div className="container px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
              <Badge variant={project.status === "Active" ? "default" : "secondary"} className="text-xs">
                {project.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>
                  {project.location.city}, {project.location.country}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(project.created_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isAnimalProject ? <Beef className="h-4 w-4" /> : <Sprout className="h-4 w-4" />}
                <span>{projectType}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
        </div>
      </div>
    </div>
  )
}
