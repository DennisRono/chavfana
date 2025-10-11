'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppDispatch } from '@/store/hooks'
import { toast } from 'sonner'
import type { ProjectResponse } from '@/types/project'

interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onSuccess,
}: EditProjectDialogProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    status: '',
    city: '',
    country: '',
    soil_type: '',
    nitrogen: '',
    phosphorous: '',
    potassium: '',
    soil_ph: '',
  })

  useEffect(() => {
    if (open && project) {
      setFormData({
        name: project.name,
        status: project.status,
        city: project.location.city,
        country: project.location.country,
        soil_type: project.soil?.type || '',
        nitrogen: project.soil?.nitrogen.toString() || '',
        phosphorous: project.soil?.phosphorous.toString() || '',
        potassium: project.soil?.potassium.toString() || '',
        soil_ph: project.soil?.soil_ph.toString() || '',
      })
    }
  }, [open, project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = {
        name: formData.name,
        status: formData.status,
        location: {
          city: formData.city,
          country: formData.country,
        },
      }

      if (formData.soil_type) {
        payload.soil = {
          type: formData.soil_type,
          nitrogen: Number.parseFloat(formData.nitrogen),
          phosphorous: Number.parseFloat(formData.phosphorous),
          potassium: Number.parseFloat(formData.potassium),
          soil_ph: Number.parseFloat(formData.soil_ph),
        }
      }

      // await dispatch(updateProject({ projectId: project.id, data: payload })).unwrap()
      toast('Success', { description: 'Project updated successfully' })
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error('Error', {
        description: err.message || 'Failed to update project',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              required
            />
          </div>

          {project.type === 'PlantingProject' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="soil_type">Soil Type</Label>
                <Input
                  id="soil_type"
                  value={formData.soil_type}
                  onChange={(e) =>
                    setFormData({ ...formData, soil_type: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nitrogen">Nitrogen</Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    step="0.01"
                    value={formData.nitrogen}
                    onChange={(e) =>
                      setFormData({ ...formData, nitrogen: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phosphorous">Phosphorous</Label>
                  <Input
                    id="phosphorous"
                    type="number"
                    step="0.01"
                    value={formData.phosphorous}
                    onChange={(e) =>
                      setFormData({ ...formData, phosphorous: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium</Label>
                  <Input
                    id="potassium"
                    type="number"
                    step="0.01"
                    value={formData.potassium}
                    onChange={(e) =>
                      setFormData({ ...formData, potassium: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soil_ph">Soil pH</Label>
                  <Input
                    id="soil_ph"
                    type="number"
                    step="0.1"
                    value={formData.soil_ph}
                    onChange={(e) =>
                      setFormData({ ...formData, soil_ph: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
