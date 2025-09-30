'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import {
  createPlantingEvent,
  updatePlantingEvent,
  getPlantingEventById,
} from '@/store/actions/planting-event'
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
    crop_name: '',
    planting_date: '',
    expected_harvest_date: '',
  })

  useEffect(() => {
    if (eventId && open) {
      const fetchEvent = async () => {
        try {
          const result = await dispatch(
            getPlantingEventById({ projectId, eventId })
          ).unwrap()
          setFormData({
            crop_name: result.crop_name,
            planting_date: result.planting_date,
            expected_harvest_date: result.expected_harvest_date,
          })
        } catch (err) {
          toast.error('Error', { description: 'Failed to load planting event' })
        }
      }
      fetchEvent()
    } else {
      setFormData({
        crop_name: '',
        planting_date: '',
        expected_harvest_date: '',
      })
    }
  }, [eventId, open, dispatch, projectId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (eventId) {
        await dispatch(
          updatePlantingEvent({ projectId, eventId, eventData: formData })
        ).unwrap()
        toast('Success', { description: 'Planting event updated successfully' })
      } else {
        await dispatch(
          createPlantingEvent({ projectId, eventData: formData })
        ).unwrap()
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {eventId ? 'Edit' : 'Create'} Planting Event
          </DialogTitle>
          <DialogDescription>
            {eventId
              ? 'Update the planting event details'
              : 'Add a new planting event to your project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crop_name">Crop Name</Label>
            <Input
              id="crop_name"
              value={formData.crop_name}
              onChange={(e) =>
                setFormData({ ...formData, crop_name: e.target.value })
              }
              placeholder="e.g., Tomatoes"
              required
            />
          </div>
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
            <Label htmlFor="expected_harvest_date">Expected Harvest Date</Label>
            <Input
              id="expected_harvest_date"
              type="date"
              value={formData.expected_harvest_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expected_harvest_date: e.target.value,
                })
              }
              required
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
