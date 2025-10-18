"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ProjectResponse } from "@/types/project"
import { useAppDispatch } from "@/store/hooks"
import { toast } from "sonner"

interface AddHealthRecordProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
}

const AddHealthRecord = ({ open, onOpenChange, project, onSuccess }: AddHealthRecordProps) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    animal_id: "",
    status: "HEALTHY" as "HEALTHY" | "SICK" | "DEAD",
    notes: "",
  })

  const getAnimals = () => {
    if (project.type !== "AnimalKeepingProject" || !project.animal_group) {
      return []
    }
    return project.animal_group.map((group) => ({
      id: group.animals.id,
      name: group.animals.name || group.animals.tag || "Unknown",
      groupName: group.group_name,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // await dispatch(addHealthRecord({ projectId: project.id, data: formData })).unwrap()
      toast("Success", { description: "Health record added successfully" })
      onSuccess()
      onOpenChange(false)
      setFormData({ animal_id: "", status: "HEALTHY", notes: "" })
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to add health record",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Health Record</DialogTitle>
          <DialogDescription>Record a health status update for an animal</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animal_id">Select Animal</Label>
            <Select
              value={formData.animal_id}
              onValueChange={(value) => setFormData({ ...formData, animal_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an animal" />
              </SelectTrigger>
              <SelectContent>
                {getAnimals().map((animal) => (
                  <SelectItem key={animal.id} value={animal.id}>
                    {animal.name} ({animal.groupName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Health Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HEALTHY">Healthy</SelectItem>
                <SelectItem value="SICK">Sick</SelectItem>
                <SelectItem value="DEAD">Dead</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any relevant notes about the health status..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.animal_id}>
              {loading ? "Saving..." : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddHealthRecord
