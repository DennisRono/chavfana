'use client'

import type React from 'react'
import { useState, useCallback, useMemo, useReducer } from 'react'
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
import type { ProjectResponse } from '@/types/project'
import { useAppDispatch } from '@/store/hooks'
import { toast } from 'sonner'
import { createPlantHarvest } from '@/store/actions/plant-harvest'

interface RecordHarvestProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
}

interface FormState {
  planting_event_id: string
  amount: string
  unit: string
  harvest_date: string
  quality: string
}

type FormAction =
  | {
      type: 'SET_FIELD'
      field: keyof FormState
      value: string
    }
  | {
      type: 'RESET'
    }

const initialFormState: FormState = {
  planting_event_id: '',
  amount: '',
  unit: 'KILOGRAM',
  harvest_date: new Date().toISOString().split('T')[0],
  quality: 'EXCELLENT',
}

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return initialFormState
    default:
      return state
  }
}

const RecordHarvest = ({
  open,
  onOpenChange,
  project,
  onSuccess,
}: RecordHarvestProps) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, formDispatch] = useReducer(formReducer, initialFormState)

  const plantingEvents = useMemo(() => {
    if (project.type !== 'PlantingProject' || !project.planting_events) {
      return []
    }
    return project.planting_events.map((event) => ({
      id: event.id,
      name: event.name,
    }))
  }, [project.type, project.planting_events])

  const selectedEvent = useMemo(() => {
    return (project.planting_events || []).find(
      (event) => event.id === formData.planting_event_id
    )
  }, [project.planting_events, formData.planting_event_id])

  const speciesId = selectedEvent?.species?.[0]?.id || ''

  const handleFieldChange = useCallback(
    (field: keyof FormState, value: string) => {
      formDispatch({ type: 'SET_FIELD', field, value })
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      try {
        const cleanedHarvestData = {
          date: formData.harvest_date,
          amount: formData.amount,
          unit: formData.unit,
          quality: formData.quality,
          species: speciesId,
        }

        await dispatch(
          createPlantHarvest({
            speciesId: speciesId,
            harvestData: cleanedHarvestData,
          })
        ).unwrap()
        toast.success('Success', {
          description: 'Harvest record created successfully',
        })

        onSuccess()
        onOpenChange(false)
        formDispatch({ type: 'RESET' })
      } catch (err: any) {
        toast.error('Error', {
          description: err.message || 'Failed to record harvest',
        })
      } finally {
        setLoading(false)
      }
    },
    [dispatch, speciesId, formData, onSuccess, onOpenChange]
  )

  const isFormValid = useMemo(() => {
    return (
      !loading &&
      formData.planting_event_id &&
      formData.amount &&
      formData.harvest_date &&
      formData.quality
    )
  }, [
    loading,
    formData.planting_event_id,
    formData.amount,
    formData.harvest_date,
    formData.quality,
  ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Record Harvest</DialogTitle>
          <DialogDescription>
            Log a harvest event for your planting project
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planting_event_id">Planting Event</Label>
            <Select
              value={formData.planting_event_id}
              onValueChange={(value) =>
                handleFieldChange('planting_event_id', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a planting event" />
              </SelectTrigger>
              <SelectContent>
                {plantingEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="harvest_date">Harvest Date</Label>
              <Input
                id="harvest_date"
                type="date"
                value={formData.harvest_date}
                onChange={(e) =>
                  handleFieldChange('harvest_date', e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleFieldChange('amount', e.target.value)}
                placeholder="Quantity harvested"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleFieldChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue defaultValue="KILOGRAM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KILOGRAM">Kilogram (kg)</SelectItem>
                  <SelectItem value="POUND">Pound (lb)</SelectItem>
                  <SelectItem value="LITER">Liter (L)</SelectItem>
                  <SelectItem value="GALLON">Gallon (gal)</SelectItem>
                  <SelectItem value="BUSHEL">Bushel</SelectItem>
                  <SelectItem value="TON">Metric Ton</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Select
                value={formData.quality}
                onValueChange={(value) => handleFieldChange('quality', value)}
              >
                <SelectTrigger>
                  <SelectValue defaultValue="EXCELLENT" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCELLENT">Excellent</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="FAIR">Fair</SelectItem>
                  <SelectItem value="POOR">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Button type="submit" disabled={!isFormValid}>
              {loading ? 'Saving...' : 'Record Harvest'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RecordHarvest
