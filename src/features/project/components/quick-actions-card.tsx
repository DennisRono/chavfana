'use client'

import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { ProjectResponse } from '@/types/project'

interface QuickActionsCardProps {
  project: ProjectResponse
  onUpdateSoilData: () => void
  onLogFeeding: () => void
}

export function QuickActionsCard({
  project,
  onUpdateSoilData,
  onLogFeeding,
}: QuickActionsCardProps) {
  const isPlantingProject = useMemo(
    () => project.type === 'PlantingProject',
    [project.type]
  )
  const isAnimalProject = useMemo(
    () => project.type === 'AnimalKeepingProject',
    [project.type]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks for this project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {isPlantingProject && (
            <>
              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={onUpdateSoilData}
              >
                <Plus className="mr-2 h-4 w-4" />
                Update Soil Data
              </Button>
            </>
          )}

          {isAnimalProject && (
            <>
              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={onLogFeeding}
              >
                <Plus className="mr-2 h-4 w-4" />
                Log Feeding
              </Button>
            </>
          )}

          {!isPlantingProject && !isAnimalProject && (
            <p className="col-span-2 text-sm text-muted-foreground">
              No quick actions available for this project.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
