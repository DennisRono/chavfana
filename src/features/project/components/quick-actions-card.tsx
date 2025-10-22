"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { ProjectResponse } from "@/types/project"

interface QuickActionsCardProps {
  project: ProjectResponse
  onRecordHarvest: () => void
  onUpdateSoilData: () => void
  onAddHealthRecord: () => void
  onLogFeeding: () => void
}

export function QuickActionsCard({
  project,
  onRecordHarvest,
  onUpdateSoilData,
  onAddHealthRecord,
  onLogFeeding,
}: QuickActionsCardProps) {
  const isPlantingProject = useMemo(() => project.type === "PlantingProject", [project.type])
  const isAnimalProject = useMemo(() => project.type === "AnimalKeepingProject", [project.type])

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
              <Button variant="outline" className="justify-start bg-transparent" onClick={onRecordHarvest}>
                <Plus className="mr-2 h-4 w-4" />
                Record Harvest
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" onClick={onUpdateSoilData}>
                <Plus className="mr-2 h-4 w-4" />
                Update Soil Data
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" onClick={onAddHealthRecord}>
                <Plus className="mr-2 h-4 w-4" />
                Add Health Record
              </Button>
            </>
          )}

          {isAnimalProject && (
            <>
              <Button variant="outline" className="justify-start bg-transparent" onClick={onLogFeeding}>
                <Plus className="mr-2 h-4 w-4" />
                Log Feeding
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" onClick={onAddHealthRecord}>
                <Plus className="mr-2 h-4 w-4" />
                Add Health Record
              </Button>
            </>
          )}

          {!isPlantingProject && !isAnimalProject && (
            <p className="col-span-2 text-sm text-muted-foreground">No quick actions available for this project.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
