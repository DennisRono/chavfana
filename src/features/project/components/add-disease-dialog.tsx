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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch } from '@/store/hooks'
import { createAnimalDisease } from '@/store/actions/animal-disease'
import { toast } from 'sonner'
import {
  animalDiseaseSchema,
  type AnimalDiseaseForm,
} from '@/schemas/animal-health-records'
import { AppDispatch } from '@/store/store'

interface AddDiseaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  speciesid: string
  eventid: string
  animalid: string
  onSuccess: () => void
}

export function AddDiseaseDialog({
  open,
  onOpenChange,
  speciesid,
  eventid,
  animalid,
  onSuccess,
}: AddDiseaseDialogProps) {
  const dispatch = useAppDispatch<AppDispatch>()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnimalDiseaseForm>({
    resolver: zodResolver(animalDiseaseSchema),
    defaultValues: {
      name: '',
      date: new Date().toISOString().split('T')[0],
      animal: animalid,
    },
  })

  const onSubmit = async (data: AnimalDiseaseForm) => {
    if (!animalid || typeof animalid !== 'string') {
      toast.error('Error', { description: 'Invalid animal ID' })
      return
    }

    if (!data || typeof data !== 'object') {
      toast.error('Error', { description: 'Invalid disease data' })
      return
    }

    if (!data.name || typeof data.name !== 'string') {
      toast.error('Error', { description: 'Please enter disease name' })
      return
    }

    if (!data.date || typeof data.date !== 'string') {
      toast.error('Error', { description: 'Please select a date' })
      return
    }

    dispatch(createAnimalDisease({ animalid, diseaseData: data }))
      .unwrap()
      .then(() => {
        toast.success('Success', {
          description: 'Disease record added successfully',
        })
        reset()
        onSuccess()
        onOpenChange(false)
      })
      .catch((err: any) => {
        const errorMessage =
          err?.message || err?.detail || 'Failed to add disease record'
        toast.error('Error', { description: errorMessage })
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Disease Record</DialogTitle>
          <DialogDescription>
            Record a disease for this animal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Disease Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    id="name"
                    placeholder="e.g., Foot and Mouth"
                    {...field}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    id="date"
                    type="date"
                    {...field}
                    disabled={isSubmitting}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">
                      {errors.date.message}
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
              {isSubmitting ? 'Adding...' : 'Add Disease'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
