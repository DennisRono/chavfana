'use client'

import { useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppDispatch } from '@/store/hooks'
import {
  createAnimalGroup,
  getAnimalGroupById,
  updateAnimalGroup,
} from '@/store/actions/animal-group'
import { toast } from 'sonner'
import {
  AnimalGroupDialogForm,
  animalGroupDialogSchema,
} from '@/schemas/animal-group-dialog'
import { isRejected } from '@reduxjs/toolkit'

interface AnimalGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  groupId?: string
  onSuccess: () => void
}

export function AnimalGroupDialog({
  open,
  onOpenChange,
  projectId,
  groupId,
  onSuccess,
}: AnimalGroupDialogProps) {
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnimalGroupDialogForm>({
    resolver: zodResolver(animalGroupDialogSchema),
    defaultValues: {
      group_name: '',
      housing: 'BARN',
      animals: {
        breed: '',
        name: '',
        gender: 'FEMALE',
        type: '',
        starting_number: 0,
        average_weight: 0,
        average_age: 0,
      },
      group_created_date: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (groupId && open) {
      const fetchGroup = async () => {
        try {
          if (!projectId || !groupId) {
            toast.error('Error', { description: 'Invalid project or group ID' })
            return
          }

          const group = await dispatch(
            getAnimalGroupById({ projectId, groupId })
          ).unwrap()

          if (!group) {
            toast.error('Error', { description: 'Group data not found' })
            return
          }

          reset({
            group_name: group.group_name ?? '',
            housing: group.housing ?? 'BARN',
            animals: {
              breed: group.animals?.breed ?? '',
              name: group.animals?.name ?? '',
              gender: group.animals?.gender ?? 'FEMALE',
              type: group.animals?.type ?? '',
              starting_number: group.animals?.starting_number ?? 0,
              average_weight: group.animals?.average_weight ?? 0,
              average_age: group.animals?.average_age ?? 0,
            },
            group_created_date:
              group.group_created_date ??
              new Date().toISOString().split('T')[0],
          })
        } catch (err: any) {
          toast.error('Error', {
            description: err?.message || 'Failed to load group data',
          })
        }
      }
      fetchGroup()
    } else if (!open) {
      reset()
    }
  }, [groupId, open, dispatch, projectId, reset])

  const onSubmit = async (data: AnimalGroupDialogForm) => {
    try {
      if (!projectId || typeof projectId !== 'string') {
        toast.error('Error', { description: 'Invalid project ID' })
        return
      }

      const payload = {
        ...data,
        group_created_date:
          data.group_created_date || new Date().toISOString().split('T')[0],
      }

      if (groupId) {
        await dispatch(updateAnimalGroup({ projectId, groupId, data: payload }))
          .unwrap()
          .then((response) => {
            console.log(response)
            if (isRejected(response)) {
              toast.error('Failed to updated Animal Group')
            } else {
              toast.success('Animal group updated successfully')
            }
          })
          .catch((error: any) => {
            console.log(error)
            toast.error(error.message || 'Failed to updated Animal Group')
          })
      } else {
        dispatch(createAnimalGroup({ projectId, data: payload }))
          .unwrap()
          .then((response) => {
            console.log(response)
            if (isRejected(response)) {
              toast.error('Failed to Create Animal Group')
            } else {
              toast.success('Animal group created successfully')
            }
          })
          .catch((error: any) => {
            console.log(error)
            toast.error(error.message || 'Failed to Create Animal Group')
          })
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error('Error', {
        description: err?.message || 'Failed to save animal group',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {groupId ? 'Edit Animal Group' : 'Create Animal Group'}
          </DialogTitle>
          <DialogDescription>
            {groupId
              ? 'Update the animal group details'
              : 'Add a new animal group to your project'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Group Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="group_name">Group Name</Label>
              <Controller
                name="group_name"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="group_name" {...field} disabled={isSubmitting} />
                    {errors.group_name && (
                      <p className="text-sm text-destructive">
                        {errors.group_name.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="housing">Housing</Label>
              <Controller
                name="housing"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select housing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BARN">Barn</SelectItem>
                        <SelectItem value="PASTURE">Pasture</SelectItem>
                        <SelectItem value="CAGE">Cage</SelectItem>
                        <SelectItem value="PEN">Pen</SelectItem>
                        <SelectItem value="COOP">Coop</SelectItem>
                        <SelectItem value="STABLE">Stable</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.housing && (
                      <p className="text-sm text-destructive">
                        {errors.housing.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Animal Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Animal Type</Label>
              <Controller
                name="animals.type"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="type"
                      placeholder="e.g., Cattle, Chicken"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {errors.animals?.type && (
                      <p className="text-sm text-destructive">
                        {errors.animals.type.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Controller
                name="animals.breed"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="breed" {...field} disabled={isSubmitting} />
                    {errors.animals?.breed && (
                      <p className="text-sm text-destructive">
                        {errors.animals.breed.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Controller
                name="animals.name"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="name" {...field} disabled={isSubmitting} />
                    {errors.animals?.name && (
                      <p className="text-sm text-destructive">
                        {errors.animals.name.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="animals.gender"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.animals?.gender && (
                      <p className="text-sm text-destructive">
                        {errors.animals.gender.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Numeric Fields */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="starting_number">Number of Animals</Label>
              <Controller
                name="animals.starting_number"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="starting_number"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value) || 0)
                      }
                      disabled={isSubmitting}
                    />
                    {errors.animals?.starting_number && (
                      <p className="text-sm text-destructive">
                        {errors.animals.starting_number.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="average_weight">Average Weight (kg)</Label>
              <Controller
                name="animals.average_weight"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="average_weight"
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                      disabled={isSubmitting}
                    />
                    {errors.animals?.average_weight && (
                      <p className="text-sm text-destructive">
                        {errors.animals.average_weight.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="average_age">Average Age (days)</Label>
              <Controller
                name="animals.average_age"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="average_age"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value) || 0)
                      }
                      disabled={isSubmitting}
                    />
                    {errors.animals?.average_age && (
                      <p className="text-sm text-destructive">
                        {errors.animals.average_age.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
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
              {isSubmitting ? 'Saving...' : groupId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
