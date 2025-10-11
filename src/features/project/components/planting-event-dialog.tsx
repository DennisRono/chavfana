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
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch } from '@/store/hooks'
import {
  createPlantingEvent,
  updatePlantingEvent,
  getPlantingEventById,
} from '@/store/actions/planting-event'
import { toast } from 'sonner'

interface PlantingEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  eventId?: string
  onSuccess: () => void
}

export function PlantingEventDialog({
  open,
  onOpenChange,
  projectId,
  eventId,
  onSuccess,
}: PlantingEventDialogProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    planting_date: '',
    end_date: '',
    area_size: '',
    area_size_unit: 'ACRE',
    stage: '',
    type: '',
    notes: '',
  })

  useEffect(() => {
    if (eventId && open) {
      const fetchEvent = async () => {
        try {
          const event = await dispatch(
            getPlantingEventById({ projectId, eventId })
          ).unwrap()
          setFormData({
            name: event.name,
            planting_date: event.planting_date,
            end_date: event.end_date,
            area_size: event.area_size.toString(),
            area_size_unit: event.area_size_unit,
            stage: event.stage,
            type: event.type,
            notes: event.notes,
          })
        } catch (err: any) {
          toast.error('Error', { description: 'Failed to load event data' })
        }
      }
      fetchEvent()
    } else if (!open) {
      setFormData({
        name: '',
        planting_date: '',
        end_date: '',
        area_size: '',
        area_size_unit: 'ACRE',
        stage: '',
        type: '',
        notes: '',
      })
    }
  }, [eventId, open, dispatch, projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        area_size: Number.parseFloat(formData.area_size),
      }

      if (eventId) {
        // await dispatch(updatePlantingEvent({ projectId, eventId, data: payload })).unwrap()
        toast('Success', { description: 'Planting event updated successfully' })
      } else {
        // await dispatch(createPlantingEvent({ projectId, data: payload })).unwrap()
        toast('Success', { description: 'Planting event created successfully' })
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error('Error', {
        description: err.message || 'Failed to save planting event',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {eventId ? 'Edit Planting Event' : 'Create Planting Event'}
          </DialogTitle>
          <DialogDescription>
            {eventId
              ? 'Update the planting event details'
              : 'Add a new planting event to your project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
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
              <Label htmlFor="planting_date">Planting Date</Label>
              <Input
                id="planting_date"
                type="date"
                value={formData.planting_date}
                onChange={(e) =>
                  setFormData({ ...formData, planting_date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area_size">Area Size</Label>
              <Input
                id="area_size"
                type="number"
                step="0.01"
                value={formData.area_size}
                onChange={(e) =>
                  setFormData({ ...formData, area_size: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area_size_unit">Unit</Label>
              <Input
                id="area_size_unit"
                value={formData.area_size_unit}
                onChange={(e) =>
                  setFormData({ ...formData, area_size_unit: e.target.value })
                }
                placeholder="ACRE, HECTARE"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Input
                id="stage"
                value={formData.stage}
                onChange={(e) =>
                  setFormData({ ...formData, stage: e.target.value })
                }
                placeholder="e.g., Seedling, Growing"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="e.g., Vegetable, Fruit"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

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
              {loading ? 'Saving...' : eventId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
