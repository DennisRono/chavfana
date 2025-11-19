'use client'

import { useForm, Controller, type Resolver } from 'react-hook-form'
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
import type { ProjectResponse } from '@/types/project'
import { useAppDispatch } from '@/store/hooks'
import { createAnimalFeed } from '@/store/actions/animal-feeds'
import { toast } from 'sonner'
import { logFeedingSchema, type LogFeedingForm } from '@/schemas/quick-actions'
import { useMemo, useState } from 'react'
import { AppDispatch } from '@/store/store'

interface LogFeedingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse | null
  onSuccess: () => void
}

export default function LogFeeding({
  open,
  onOpenChange,
  project,
  onSuccess,
}: LogFeedingProps) {
  const dispatch = useAppDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogFeedingForm>({
    resolver: zodResolver(logFeedingSchema) as Resolver<LogFeedingForm>,
    defaultValues: {
      animal_id: '',
      name: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      unit: 'KILOGRAM',
      nutrients: {
        protein: 0,
        carbohydrates: 0,
        minerals: 0,
        unit: 'KILOGRAM',
      },
    },
  })

  const animals = useMemo(() => {
    if (!project || typeof project !== 'object') return []
    if (project.type !== 'AnimalKeepingProject') return []
    if (!Array.isArray(project.animal_group)) return []

    return project.animal_group.flatMap((group) => {
      const animal = group?.animals
      if (!animal || typeof animal !== 'object') return []
      return {
        id: animal.id ?? '',
        name: animal.name || animal.tag || 'Unknown Animal',
        groupName: group.group_name ?? 'Unnamed Group',
      }
    })
  }, [project])

  const onSubmit = async (data: LogFeedingForm) => {
    setIsLoading(true)
    dispatch(createAnimalFeed({
      animalId: data.animal_id,
      feedData: {
        animal: data.animal_id,
        date: data.date,
        name: data.name,
        amount: data.amount,
        unit: data.unit,
        nutrients: {
          protein: data.nutrients.protein,
          carbohydrates: data.nutrients.carbohydrates,
          minerals: data.nutrients.minerals,
          unit: data.nutrients.unit,
        },
      },
    }))
      .unwrap()
      .then(() => {
        toast.success('Feeding record logged successfully')
        reset()
        onSuccess()
        onOpenChange(false)
      })
      .catch((err: any) => {
        console.error('Submit error:', err)
        toast.error('Error', {
          description: err?.message || 'Failed to log feeding record',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Feeding</DialogTitle>
          <DialogDescription>
            Record a feeding event for your animals
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animal_id">Animal</Label>
            <Controller
              name="animal_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
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
                      <SelectItem value="" disabled>
                        No animals available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.animal_id && (
              <p className="text-sm text-destructive">
                {errors.animal_id.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Feed Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="e.g., Corn, Hay, Pellets"
                    {...field}
                    disabled={isLoading}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Feeding Date</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Input
                    id="date"
                    type="date"
                    {...field}
                    disabled={isLoading}
                  />
                )}
              />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Amount of feed"
                    {...field}
                    disabled={isLoading}
                    onChange={(e) =>
                      field.onChange(Number.parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KILOGRAM">Kilogram (kg)</SelectItem>
                      <SelectItem value="POUND">Pound (lb)</SelectItem>
                      <SelectItem value="LITER">Liter (L)</SelectItem>
                      <SelectItem value="GALLON">Gallon (gal)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.unit && (
                <p className="text-sm text-destructive">
                  {errors.unit.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {['protein', 'carbohydrates', 'minerals'].map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} (kg)
                </Label>
                <Controller
                  name={`nutrients.${key}` as any}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id={key}
                      type="number"
                      step="0.01"
                      {...field}
                      disabled={isLoading}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  )}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Log Feeding'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
