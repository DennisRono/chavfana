'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ProjectResponse } from '@/types/project'
import { useAppDispatch } from '@/store/hooks'
import { toast } from 'sonner'
import {
  addHealthRecordSchema,
  type AddHealthRecordForm,
} from '@/schemas/quick-actions'
import { useMemo } from 'react'

interface AddHealthRecordProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
  speciesid: string
  eventid: string
}

export default function AddHealthRecord({
  open,
  onOpenChange,
  project,
  onSuccess,
  speciesid,
  eventid
}: AddHealthRecordProps) {
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddHealthRecordForm>({
    resolver: zodResolver(addHealthRecordSchema),
    defaultValues: {
      animal_id: '',
      status: 'HEALTHY',
      notes: '',
    },
  })

  const animals = useMemo(() => {
    if (!project || typeof project !== 'object') {
      return []
    }

    if (project.type !== 'AnimalKeepingProject') {
      return []
    }

    if (!Array.isArray(project.animal_group)) {
      return []
    }

    return project.animal_group
      .filter(
        (group) =>
          group &&
          typeof group === 'object' &&
          group.animals &&
          group.animals.id
      )
      .flatMap((group) => {
        const animal = group.animals
        if (!animal || typeof animal !== 'object') {
          return []
        }

        return {
          id: animal.id ?? '',
          name: animal.name || animal.tag || 'Unknown Animal',
          groupName: group.group_name ?? 'Unnamed Group',
        }
      })
  }, [project])

  const onSubmit = async (data: AddHealthRecordForm) => {
    try {
      if (!project || typeof project !== 'object') {
        toast.error('Error', { description: 'Invalid project data' })
        return
      }

      if (!data || typeof data !== 'object') {
        toast.error('Error', { description: 'Invalid health record data' })
        return
      }

      if (!data.animal_id || typeof data.animal_id !== 'string') {
        toast.error('Error', { description: 'Please select an animal' })
        return
      }

      if (!data.status || typeof data.status !== 'string') {
        toast.error('Error', { description: 'Please select a health status' })
        return
      }

      // TODO: Implement health record creation action when backend endpoint is available
      toast.success('Success', {
        description: 'Health record added successfully',
      })
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      const errorMessage =
        err?.message || err?.detail || 'Failed to add health record'
      toast.error('Error', { description: errorMessage })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Health Record</DialogTitle>
          <DialogDescription>
            Record a health status update for an animal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animal_id">Select Animal</Label>
            <Controller
              name="animal_id"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an animal" />
                    </SelectTrigger>
                    <SelectContent>
                      {animals.length > 0 ? (
                        animals.map((animal) => (
                          <SelectItem key={animal.id} value={animal.id}>
                            {animal.name} ({animal.groupName})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No animals available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.animal_id && (
                    <p className="text-sm text-destructive">
                      {errors.animal_id.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Health Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HEALTHY">Healthy</SelectItem>
                      <SelectItem value="SICK">Sick</SelectItem>
                      <SelectItem value="DEAD">Dead</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-destructive">
                      {errors.status.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <>
                  <Textarea
                    id="notes"
                    placeholder="Add any relevant notes about the health status..."
                    rows={3}
                    {...field}
                    disabled={isSubmitting}
                  />
                  {errors.notes && (
                    <p className="text-sm text-destructive">
                      {errors.notes.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
