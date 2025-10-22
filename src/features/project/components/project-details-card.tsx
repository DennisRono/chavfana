"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { ProjectResponse } from "@/types/project"

interface ProjectDetailsCardProps {
  project: ProjectResponse
}

export function ProjectDetailsCard({ project }: ProjectDetailsCardProps) {
  const isAnimalProject = useMemo(() => project.type === "AnimalKeepingProject", [project.type])

  const formatCoordinate = useMemo(
    () =>
      (coordinate: any): string => {
        if (!coordinate) return ""
        if (typeof coordinate === "object" && "latitude" in coordinate && "longitude" in coordinate) {
          return `${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`
        }
        return ""
      },
    [],
  )

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <p className="mt-1 text-sm text-foreground">{project.status}</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-muted-foreground">Location</p>
          <p className="mt-1 text-sm text-foreground">{project.location.city}</p>
          <p className="text-sm text-muted-foreground">{project.location.country}</p>
          {project.location.coordinate && (
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {formatCoordinate(project.location.coordinate)}
            </p>
          )}
        </div>
        {project.soil && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Soil Information</p>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="text-foreground">{project.soil.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">pH</span>
                  <span className="text-foreground">{project.soil.soil_ph}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nitrogen</span>
                  <span className="text-foreground">{project.soil.nitrogen}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phosphorous</span>
                  <span className="text-foreground">{project.soil.phosphorous}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Potassium</span>
                  <span className="text-foreground">{project.soil.potassium}</span>
                </div>
              </div>
            </div>
          </>
        )}
        {!isAnimalProject && project.total_project_planted_area_size !== undefined && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Planted Area</p>
              <p className="mt-1 text-sm text-foreground">{project.total_project_planted_area_size} acres</p>
            </div>
          </>
        )}
        {isAnimalProject && project.total_project_animal !== undefined && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Animals</p>
              <p className="mt-1 text-sm text-foreground">{project.total_project_animal}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
