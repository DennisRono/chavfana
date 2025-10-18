'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
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
import { toast } from 'sonner'
import type { ProjectResponse } from '@/types/project'
import africanCountries from '@/data/countries.json'

const soilSchema = z
  .object({
    type: z.string().optional(),
    nitrogen: z
      .union([z.string(), z.number()])
      .transform((v) => (v === '' ? undefined : Number(v)))
      .optional(),
    phosphorous: z
      .union([z.string(), z.number()])
      .transform((v) => (v === '' ? undefined : Number(v)))
      .optional(),
    potassium: z
      .union([z.string(), z.number()])
      .transform((v) => (v === '' ? undefined : Number(v)))
      .optional(),
    soil_ph: z
      .union([z.string(), z.number()])
      .transform((v) => (v === '' ? undefined : Number(v)))
      .optional(),
  })
  .optional()

const projectSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['Planning', 'Active', 'Completed', 'Archived']),
  location: z.object({
    country: z.string().min(1),
    city: z.string().min(1),
  }),
  soil: soilSchema,
})

type ProjectFormValues = z.infer<typeof projectSchema>

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

  const form = useForm<any>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      status: 'Planning',
      location: { country: '', city: '' },
      soil: project.type === 'PlantingProject' ? {} : undefined,
    },
  })

  useEffect(() => {
    if (open && project) {
      form.reset({
        name: project.name ?? '',
        status:
          (project.status as
            | 'Planning'
            | 'Active'
            | 'Completed'
            | 'Archived') || 'Planning',
        location: {
          city: project.location?.city ?? '',
          country: project.location?.country ?? '',
        },
        soil:
          project.type === 'PlantingProject'
            ? {
                type: project.soil?.type ?? '',
                nitrogen: project.soil?.nitrogen ?? undefined,
                phosphorous: project.soil?.phosphorous ?? undefined,
                potassium: project.soil?.potassium ?? undefined,
                soil_ph: project.soil?.soil_ph ?? undefined,
              }
            : undefined,
      })
    }
  }, [open, project, form])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload: ProjectFormValues = {
        name: data.name,
        status: data.status,
        location: data.location,
        soil: project.type === 'PlantingProject' ? data.soil : undefined,
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

  const selectedCountry = form.watch('location.country')
  const availableCities =
    africanCountries.find((c) => c.code === selectedCountry)?.cities || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project details</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" {...form.register('name')} required />
          </div>

          <div className="flex gap-x-4">
            <div className="space-y-2 flex-1">
              <Label>Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) =>
                  form.setValue(
                    'status',
                    value as 'Planning' | 'Active' | 'Completed' | 'Archived'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <Label>Country</Label>
              <Select
                value={form.watch('location.country')}
                onValueChange={(value) =>
                  form.setValue('location.country', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {africanCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <Label>City</Label>
              <Select
                value={form.watch('location.city')}
                onValueChange={(value) => form.setValue('location.city', value)}
                disabled={!availableCities.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {project.type === 'PlantingProject' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="soil_type">Soil Type</Label>
                <Input id="soil_type" {...form.register('soil.type')} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nitrogen">Nitrogen</Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    step="0.01"
                    {...form.register('soil.nitrogen')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phosphorous">Phosphorous</Label>
                  <Input
                    id="phosphorous"
                    type="number"
                    step="0.01"
                    {...form.register('soil.phosphorous')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium</Label>
                  <Input
                    id="potassium"
                    type="number"
                    step="0.01"
                    {...form.register('soil.potassium')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soil_ph">Soil pH</Label>
                  <Input
                    id="soil_ph"
                    type="number"
                    step="0.1"
                    {...form.register('soil.soil_ph')}
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
