'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Beef,
  CheckCircle,
  Navigation,
  Users,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { createProject } from '@/store/actions/project'
import { useAppDispatch } from '@/store/hooks'
import type { AppDispatch } from '@/store/store'
import { useCallback, useEffect, useState } from 'react'
import africanCountries from '@/data/countries.json'
import { useUserLocation } from '@/hooks/use-user-location'
import { useRouter } from 'next/navigation'
import type { ProjectData } from '@/types/project'
import { z } from 'zod'

const CoordinateSchema = z.object({
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .refine((val) => !isNaN(val), 'Latitude must be a valid number'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .refine((val) => !isNaN(val), 'Longitude must be a valid number'),
})

const LocationSchema = z.object({
  country: z
    .string()
    .min(2, 'Country code is required')
    .max(2, 'Country code must be 2 characters')
    .refine(
      (code) => africanCountries.some((c) => c.code === code),
      'Invalid country code'
    ),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City name too long')
    .refine((val) => val.trim().length > 0, 'City cannot be empty'),
  coordinate: CoordinateSchema,
})

const DateSchema = z
  .string()
  .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: 'Date must be in YYYY-MM-DD format or empty',
  })
  .optional()

const UUIDSchema = z.uuid('Invalid UUID format').optional()

const AnimalTypeSchema = z.enum(['Group', 'Individual'], {
  error: 'Animal type must be Group or Individual',
})

const HousingTypeSchema = z.enum(
  ['BARN', 'PASTURE', 'CAGE', 'PEN', 'COOP', 'STABLE', 'FREE_RANGE', 'MIXED'],
  {
    error: 'Valid housing type is required',
  }
)

const IndividualAnimalCoreSchema = z.object({
  tag: z
    .string()
    .min(1, 'Tag ID is required')
    .max(50, 'Tag ID too long')
    .refine((val) => val.trim().length > 0, 'Tag ID cannot be empty'),
  breed: z
    .string()
    .min(1, 'Breed is required')
    .max(100, 'Breed name too long')
    .refine((val) => val.trim().length > 0, 'Breed cannot be empty'),
  name: z
    .string()
    .min(1, 'Animal name is required')
    .max(100, 'Animal name too long')
    .refine((val) => val.trim().length > 0, 'Animal name cannot be empty'),
  type: AnimalTypeSchema,
  gender: z.enum(['MALE', 'FEMALE'], {
    error: 'Gender must be MALE or FEMALE',
  }),
  weight: z
    .number()
    .min(0, 'Weight cannot be negative')
    .max(5000, 'Weight must be reasonable')
    .refine((val) => !isNaN(val), 'Weight must be a valid number'),
  age: z
    .number()
    .min(0, 'Age cannot be negative')
    .max(1000, 'Age must be reasonable')
    .refine((val) => !isNaN(val), 'Age must be a valid number'),
  arrival_date: DateSchema,
  birthday: DateSchema,
  notes: z.string().max(500, 'Notes too long').optional(),
})

const GroupAnimalCoreSchema = z.object({
  breed: z
    .string()
    .min(1, 'Breed is required')
    .max(100, 'Breed name too long')
    .refine((val) => val.trim().length > 0, 'Breed cannot be empty'),
  name: z
    .string()
    .min(1, 'Group name is required')
    .max(100, 'Group name too long')
    .refine((val) => val.trim().length > 0, 'Group name cannot be empty'),
  type: AnimalTypeSchema,
  gender: z.enum(['MALE', 'FEMALE', 'BOTH'], {
    error: 'Gender must be MALE, FEMALE, or BOTH',
  }),
  starting_number: z
    .number()
    .int('Starting number must be an integer')
    .min(1, 'Starting number must be at least 1')
    .max(100000, 'Starting number too large')
    .refine((val) => !isNaN(val), 'Starting number must be valid'),
  average_weight: z
    .number()
    .min(0, 'Average weight cannot be negative')
    .max(5000, 'Average weight must be reasonable')
    .optional()
    .refine((val) => !val || !isNaN(val), 'Average weight must be valid'),
  average_age: z
    .number()
    .min(0, 'Average age cannot be negative')
    .max(1000, 'Average age must be reasonable')
    .optional()
    .refine((val) => !val || !isNaN(val), 'Average age must be valid'),
  arrival_date: DateSchema,
  birthday: DateSchema,
  notes: z.string().max(500, 'Notes too long').optional(),
})

const IndividualGroupSchema = z.object({
  type: z.literal('Individual'),
  group_name: z
    .string()
    .min(1, 'Group name is required')
    .max(100, 'Group name too long')
    .refine((val) => val.trim().length > 0, 'Group name cannot be empty'),
  housing: HousingTypeSchema,
  group_created_date: DateSchema,
  animals: z
    .array(IndividualAnimalCoreSchema)
    .min(1, 'At least one animal is required')
    .max(1000, 'Too many animals'),
})

const PackGroupSchema = z.object({
  type: z.literal('Group'),
  group_name: z
    .string()
    .min(1, 'Group name is required')
    .max(100, 'Group name too long')
    .refine((val) => val.trim().length > 0, 'Group name cannot be empty'),
  housing: HousingTypeSchema,
  group_created_date: DateSchema,
  pack: GroupAnimalCoreSchema,
})

const AnimalGroupSchema = z.discriminatedUnion('type', [
  IndividualGroupSchema,
  PackGroupSchema,
])

const AnimalProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Project name is required')
      .max(100, 'Project name must be less than 100 characters')
      .refine((val) => val.trim().length > 0, 'Project name cannot be empty'),
    created_date: DateSchema,
    type: z.literal('AnimalKeepingProject'),
    status: z.enum(['Planning', 'Active', 'Completed'], {
      error: 'Valid status is required',
    }),

    location: LocationSchema,
    animal_group: AnimalGroupSchema,
    farm_id: UUIDSchema,
    plot_id: UUIDSchema,
  })
  .refine(
    (data) => {
      if (data.animal_group.type === 'Individual') {
        return data.animal_group.animals.every((animal) => {
          if (animal.arrival_date && animal.birthday) {
            return new Date(animal.arrival_date) >= new Date(animal.birthday)
          }
          return true
        })
      }
      return true
    },
    {
      message: 'Arrival date cannot be before birthday',
      path: ['animal_group'],
    }
  )

type AnimalProjectForm = z.infer<typeof AnimalProjectSchema>
type IndividualAnimalForm = z.infer<typeof IndividualAnimalCoreSchema>
type GroupAnimalForm = z.infer<typeof GroupAnimalCoreSchema>
type AnimalGroupForm = z.infer<typeof AnimalGroupSchema>

const DEFAULT_WEATHER = {
  temperature: 0,
  humidity: 0,
}

export default function AnimalFarmingForm() {
  const [activeTab, setActiveTab] = useState<'Individual' | 'Group'>(
    'Individual'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    coordinates,
    error: locationError,
    permissionState,
    isLoading: locationLoading,
    requestLocation,
  } = useUserLocation()

  const dispatch = useAppDispatch<AppDispatch>()
  const router = useRouter()

  const form = useForm<AnimalProjectForm>({
    resolver: zodResolver(AnimalProjectSchema),
    defaultValues: {
      name: '',
      created_date: new Date().toISOString().split('T')[0],
      type: 'AnimalKeepingProject',
      status: 'Active',
      location: {
        country: 'KE',
        city: 'Nairobi',
        coordinate: { latitude: 0, longitude: 0 },
      },
      animal_group: {
        type: 'Individual',
        group_name: '',
        housing: 'BARN',
        group_created_date: new Date().toISOString().split('T')[0],
        animals: [
          {
            tag: '',
            breed: '',
            name: '',
            type: 'Individual',
            gender: 'MALE',
            weight: 0,
            age: 0,
            arrival_date: new Date().toISOString().split('T')[0],
            birthday: '',
            notes: '',
          },
        ],
      } as AnimalGroupForm,
    },
  })

  useEffect(() => {
    if (permissionState === 'granted' && coordinates) {
      form.setValue('location.coordinate.latitude', coordinates.latitude, {
        shouldValidate: true,
      })
      form.setValue('location.coordinate.longitude', coordinates.longitude, {
        shouldValidate: true,
      })
    }
  }, [permissionState, coordinates, form])

  const acquireLocation = useCallback(async () => {
    try {
      await requestLocation()
      if (coordinates) {
        toast.success('Location captured', {
          description: `Coordinates: ${coordinates.latitude.toFixed(
            4
          )}, ${coordinates.longitude.toFixed(4)}`,
        })
      }
    } catch (err) {
      toast.error('Location access failed', {
        description:
          String(locationError) || 'Check browser permissions and retry',
      })
    }
  }, [requestLocation, coordinates, locationError])

  const individualAnimals =
    form.watch('animal_group.type') === 'Individual'
      ? (
          form.watch('animal_group') as Extract<
            AnimalGroupForm,
            { type: 'Individual' }
          >
        ).animals
      : []

  const appendAnimal = () => {
    if (form.getValues('animal_group.type') === 'Individual') {
      const currentGroup = form.getValues('animal_group') as Extract<
        AnimalGroupForm,
        { type: 'Individual' }
      >
      const updatedAnimals: any = [
        ...currentGroup.animals,
        {
          tag: '',
          breed: '',
          name: '',
          type: 'Individual',
          gender: 'MALE',
          weight: 0,
          age: 0,
          arrival_date: new Date().toISOString().split('T')[0],
          birthday: '',
          notes: '',
        },
      ]
      form.setValue('animal_group.animals', updatedAnimals, {
        shouldValidate: true,
      })
    }
  }

  const removeAnimal = (index: number) => {
    if (form.getValues('animal_group.type') === 'Individual') {
      const currentGroup = form.getValues('animal_group') as Extract<
        AnimalGroupForm,
        { type: 'Individual' }
      >
      if (currentGroup.animals.length > 1) {
        const updatedAnimals = currentGroup.animals.filter(
          (_, i) => i !== index
        )
        form.setValue('animal_group.animals', updatedAnimals, {
          shouldValidate: true,
        })
      }
    }
  }

  const modifyAnimal = (
    index: number,
    field: keyof IndividualAnimalForm,
    value: any
  ) => {
    if (form.getValues('animal_group.type') === 'Individual') {
      const currentGroup = form.getValues('animal_group') as Extract<
        AnimalGroupForm,
        { type: 'Individual' }
      >
      const updatedAnimals = currentGroup.animals.map((animal, i) =>
        i === index ? { ...animal, [field]: value } : animal
      )
      form.setValue('animal_group.animals', updatedAnimals, {
        shouldValidate: true,
      })
    }
  }

  const modifyPack = (field: keyof GroupAnimalForm, value: any) => {
    if (form.getValues('animal_group.type') === 'Group') {
      form.setValue(`animal_group.pack.${field}`, value, {
        shouldValidate: true,
      })
    }
  }

  const switchTab = (tab: 'Individual' | 'Group') => {
    const currentData = form.getValues()
    setActiveTab(tab)

    if (tab === 'Individual') {
      form.setValue('animal_group', {
        type: 'Individual',
        group_name: currentData.animal_group.group_name,
        housing: currentData.animal_group.housing,
        group_created_date: currentData.animal_group.group_created_date,
        animals: [
          {
            tag: '',
            breed: '',
            name: '',
            type: 'Individual',
            gender: 'MALE',
            weight: 0,
            age: 0,
            arrival_date: new Date().toISOString().split('T')[0],
            birthday: '',
            notes: '',
          },
        ],
      } as AnimalGroupForm)
    } else {
      form.setValue('animal_group', {
        type: 'Group',
        group_name: currentData.animal_group.group_name,
        housing: currentData.animal_group.housing,
        group_created_date: currentData.animal_group.group_created_date,
        pack: {
          breed: '',
          name: '',
          type: 'Group',
          gender: 'MALE',
          starting_number: 1,
          average_weight: 0,
          average_age: 0,
          arrival_date: new Date().toISOString().split('T')[0],
          birthday: '',
          notes: '',
        },
      } as AnimalGroupForm)
    }
  }

  const constructSubmissionData = (data: AnimalProjectForm): ProjectData => {
    const basePayload: any = {
      name: data.name.trim(),
      created_date: data.created_date || new Date().toISOString().split('T')[0],
      type: 'AnimalKeepingProject',
      status: data.status,
      location: {
        country: data.location.country,
        city: data.location.city.trim(),
        coordinate: data.location.coordinate,
      },
      weather: DEFAULT_WEATHER,
    }

    if (data.farm_id) basePayload.farm_id = data.farm_id
    if (data.plot_id) basePayload.plot_id = data.plot_id

    if (data.animal_group.type === 'Individual') {
      basePayload.animal_group = {
        type: 'Individual',
        group_name: data.animal_group.group_name.trim(),
        housing: data.animal_group.housing,
        group_created_date: data.animal_group.group_created_date,
        animals: data.animal_group.animals.map((animal) => ({
          tag: animal.tag.trim(),
          breed: animal.breed.trim(),
          name: animal.name.trim(),
          type: animal.type,
          gender: animal.gender,
          weight: Number(animal.weight),
          age: Number(animal.age),
          arrival_date: animal.arrival_date || undefined,
          birthday: animal.birthday || undefined,
          notes: animal.notes?.trim() || undefined,
        })),
      }
    } else {
      basePayload.animal_group = {
        type: 'Group',
        group_name: data.animal_group.group_name.trim(),
        housing: data.animal_group.housing,
        group_created_date: data.animal_group.group_created_date,
        pack: {
          breed: data.animal_group.pack.breed.trim(),
          name: data.animal_group.pack.name.trim(),
          type: data.animal_group.pack.type,
          gender: data.animal_group.pack.gender,
          starting_number: Number(data.animal_group.pack.starting_number),
          average_weight: data.animal_group.pack.average_weight
            ? Number(data.animal_group.pack.average_weight)
            : undefined,
          average_age: data.animal_group.pack.average_age
            ? Number(data.animal_group.pack.average_age)
            : undefined,
          arrival_date: data.animal_group.pack.arrival_date || undefined,
          birthday: data.animal_group.pack.birthday || undefined,
          notes: data.animal_group.pack.notes?.trim() || undefined,
        },
      }
    }

    return basePayload as ProjectData
  }

  const submitForm = async (data: AnimalProjectForm) => {
    setIsSubmitting(true)
    try {
      const submissionData = constructSubmissionData(data)
      console.log(submissionData)
      const result = await dispatch(createProject(submissionData)).unwrap()

      toast.success('Project created', {
        description: 'Animal farming project successfully established',
      })
      router.push(`/project/${result.id}`)
    } catch (error: any) {
      console.error('Submission failure:', error)
      toast.error('Creation failed', {
        description:
          error?.message || 'Project creation unsuccessful. Please retry.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const extractAnimalGroupErrors = () => {
    return form.formState.errors.animal_group || {}
  }

  const extractAnimalErrors = (index: number) => {
    const groupErrors = extractAnimalGroupErrors()
    if (
      groupErrors &&
      'animals' in groupErrors &&
      Array.isArray(groupErrors.animals)
    ) {
      return groupErrors.animals[index] || {}
    }
    return {}
  }

  const extractPackErrors: any = () => {
    const groupErrors = extractAnimalGroupErrors()
    if (groupErrors && 'pack' in groupErrors) {
      return groupErrors.pack || {}
    }
    return {}
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 h-12 bg-clip-text text-transparent mb-2">
            Animal Farming Management
          </h2>
          <p className="text-gray-600 text-lg">
            Manage your livestock and animal records with precision
          </p>
        </div>

        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm !pt-0">
            <CardHeader className="bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-t-lg py-2">
              <CardTitle className="text-xl">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    placeholder="Dairy Cattle Group A"
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-x-4">
                  <div className="space-y-2 flex-1">
                    <Label>Status</Label>
                    <Select
                      value={form.watch('status')}
                      onValueChange={(
                        value: 'Planning' | 'Active' | 'Completed'
                      ) =>
                        form.setValue('status', value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label>Country</Label>
                    <Select
                      value={form.watch('location.country')}
                      onValueChange={(value) =>
                        form.setValue('location.country', value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {africanCountries.map((country) => (
                          <SelectItem value={country.code} key={country.code}>
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
                      onValueChange={(value) =>
                        form.setValue('location.city', value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {africanCountries
                          .find(
                            (country) =>
                              country.code === form.watch('location.country')
                          )
                          ?.cities.map((city) => (
                            <SelectItem value={city} key={city}>
                              {city}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      Location Coordinates
                    </Label>
                    {permissionState === 'granted' && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Auto-detected
                        </span>
                      </div>
                    )}
                  </div>

                  {permissionState === 'granted' ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-green-700 dark:text-green-300">
                            Latitude
                          </Label>
                          <p className="font-mono text-sm font-medium">
                            {coordinates?.latitude?.toFixed(6) || '0.000000'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-green-700 dark:text-green-300">
                            Longitude
                          </Label>
                          <p className="font-mono text-sm font-medium">
                            {coordinates?.longitude?.toFixed(6) || '0.000000'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude" className="text-sm">
                            Latitude
                          </Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            {...form.register('location.coordinate.latitude', {
                              valueAsNumber: true,
                            })}
                          />
                          {form.formState.errors.location?.coordinate
                            ?.latitude && (
                            <p className="text-sm text-red-500">
                              {
                                form.formState.errors.location.coordinate
                                  .latitude.message
                              }
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longitude" className="text-sm">
                            Longitude
                          </Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            {...form.register('location.coordinate.longitude', {
                              valueAsNumber: true,
                            })}
                          />
                          {form.formState.errors.location?.coordinate
                            ?.longitude && (
                            <p className="text-sm text-red-500">
                              {
                                form.formState.errors.location.coordinate
                                  .longitude.message
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      {(permissionState === 'prompt' ||
                        permissionState === 'denied') && (
                        <Button
                          type="button"
                          onClick={acquireLocation}
                          disabled={locationLoading}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          {locationLoading
                            ? 'Requesting Location...'
                            : 'Use Current Location'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              switchTab(value as 'Individual' | 'Group')
            }
            className="space-y-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/80 backdrop-blur-sm border shadow-lg">
              <TabsTrigger
                value="Individual"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-700 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
              >
                <Beef className="h-4 w-4" />
                Individual Records
              </TabsTrigger>
              <TabsTrigger
                value="Group"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-700 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
              >
                <Users className="h-4 w-4" />
                Group Records
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Individual">
              <Card className="border-1 shadow-lg bg-white/80 backdrop-blur-sm pt-0">
                <CardHeader className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-t-lg py-2">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Beef className="h-5 w-5" />
                    Individual Animal Record
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <Card className="border-0 shadow-md bg-gray-50/50">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">
                          Group Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Group Name</Label>
                            <Input
                              placeholder="Main Cattle Herd"
                              {...form.register('animal_group.group_name')}
                            />
                            {extractAnimalGroupErrors().group_name && (
                              <p className="text-sm text-red-500">
                                {extractAnimalGroupErrors().group_name?.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Housing Type</Label>
                            <Select
                              value={form.watch('animal_group.housing')}
                              onValueChange={(value: any) =>
                                form.setValue('animal_group.housing', value, {
                                  shouldValidate: true,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BARN">Barn</SelectItem>
                                <SelectItem value="PASTURE">Pasture</SelectItem>
                                <SelectItem value="CAGE">Cage</SelectItem>
                                <SelectItem value="PEN">Pen</SelectItem>
                                <SelectItem value="COOP">Coop</SelectItem>
                                <SelectItem value="STABLE">Stable</SelectItem>
                                <SelectItem value="FREE_RANGE">
                                  Free Range
                                </SelectItem>
                                <SelectItem value="MIXED">Mixed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Group Created Date</Label>
                            <Input
                              type="date"
                              {...form.register(
                                'animal_group.group_created_date'
                              )}
                            />
                            {extractAnimalGroupErrors().group_created_date && (
                              <p className="text-sm text-red-500">
                                {
                                  extractAnimalGroupErrors().group_created_date
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Animals</h3>
                      {individualAnimals.map((animal, index) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border rounded-lg bg-gray-50"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-lg">
                              Animal {index + 1}
                            </h4>
                            {individualAnimals.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeAnimal(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Tag ID *</Label>
                              <Input
                                value={animal.tag}
                                onChange={(e) =>
                                  modifyAnimal(index, 'tag', e.target.value)
                                }
                              />
                              {extractAnimalErrors(index).tag && (
                                <p className="text-sm text-red-500">
                                  {extractAnimalErrors(index).tag?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Breed *</Label>
                              <Input
                                value={animal.breed}
                                onChange={(e) =>
                                  modifyAnimal(index, 'breed', e.target.value)
                                }
                              />
                              {extractAnimalErrors(index).breed && (
                                <p className="text-sm text-red-500">
                                  {extractAnimalErrors(index).breed?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Name *</Label>
                              <Input
                                value={animal.name}
                                onChange={(e) =>
                                  modifyAnimal(index, 'name', e.target.value)
                                }
                              />
                              {extractAnimalErrors(index).name && (
                                <p className="text-sm text-red-500">
                                  {extractAnimalErrors(index).name?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Animal Type *</Label>
                              <Select
                                value={animal.type}
                                onValueChange={(value) =>
                                  modifyAnimal(index, 'type', value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Individual">
                                    Individual
                                  </SelectItem>
                                  <SelectItem value="Group">Group</SelectItem>
                                </SelectContent>
                              </Select>
                              {extractAnimalErrors(index).type && (
                                <p className="text-sm text-red-500">
                                  {extractAnimalErrors(index).type?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Gender *</Label>
                              <Select
                                value={animal.gender}
                                onValueChange={(value) =>
                                  modifyAnimal(index, 'gender', value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MALE">Male</SelectItem>
                                  <SelectItem value="FEMALE">Female</SelectItem>
                                </SelectContent>
                              </Select>
                              {extractAnimalErrors(index).gender && (
                                <p className="text-sm text-red-500">
                                  {extractAnimalErrors(index).gender?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Age (months) *</Label>
                              <Input
                                type="number"
                                value={animal.age}
                                onChange={(e) =>
                                  modifyAnimal(
                                    index,
                                    'age',
                                    Number(e.target.value)
                                  )
                                }
                              />
                              {extractAnimalErrors(index).age && (
                                <p className="text-sm text-red-500">
                                  {extractAnimalErrors(index).age?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Weight (kg) *</Label>
                              <Input
                                type="number"
                                value={animal.weight}
                                onChange={(e) =>
                                  modifyAnimal(
                                    index,
                                    'weight',
                                    Number(e.target.value)
                                  )
                                }
                              />
                              {extractAnimalErrors(index).weight && (
                                <p className="text-sm text-red-500">
                                  {extractAnimalErrors(index).weight?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Arrival Date</Label>
                              <Input
                                type="date"
                                value={animal.arrival_date || ''}
                                onChange={(e) =>
                                  modifyAnimal(
                                    index,
                                    'arrival_date',
                                    e.target.value
                                  )
                                }
                              />
                              {extractAnimalErrors(index).arrival_date && (
                                <p className="text-sm text-red-500">
                                  {
                                    extractAnimalErrors(index).arrival_date
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Birthday</Label>
                              <Input
                                type="date"
                                value={animal.birthday || ''}
                                onChange={(e) =>
                                  modifyAnimal(
                                    index,
                                    'birthday',
                                    e.target.value
                                  )
                                }
                              />
                              {extractAnimalErrors(index).birthday && (
                                <p className="text-sm text-red-500">
                                  {extractAnimalErrors(index).birthday?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Notes</Label>
                              <Input
                                value={animal.notes || ''}
                                onChange={(e) =>
                                  modifyAnimal(index, 'notes', e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={appendAnimal}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Animal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Group">
              <div className="space-y-4">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm !pt-0">
                  <CardHeader className="bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-t-lg py-2">
                    <CardTitle className="text-xl">
                      Animal Group Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Group Name</Label>
                        <Input
                          placeholder="Group A"
                          {...form.register('animal_group.group_name')}
                        />
                        {extractAnimalGroupErrors().group_name && (
                          <p className="text-sm text-red-500">
                            {extractAnimalGroupErrors().group_name?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Housing Type</Label>
                        <Select
                          value={form.watch('animal_group.housing')}
                          onValueChange={(value: any) =>
                            form.setValue('animal_group.housing', value, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BARN">Barn</SelectItem>
                            <SelectItem value="PASTURE">Pasture</SelectItem>
                            <SelectItem value="CAGE">Cage</SelectItem>
                            <SelectItem value="PEN">Pen</SelectItem>
                            <SelectItem value="COOP">Coop</SelectItem>
                            <SelectItem value="STABLE">Stable</SelectItem>
                            <SelectItem value="FREE_RANGE">
                              Free Range
                            </SelectItem>
                            <SelectItem value="MIXED">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Group Created Date</Label>
                        <Input
                          type="date"
                          {...form.register('animal_group.group_created_date')}
                        />
                        {extractAnimalGroupErrors().group_created_date && (
                          <p className="text-sm text-red-500">
                            {
                              extractAnimalGroupErrors().group_created_date
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-1 shadow-lg bg-white/80 backdrop-blur-sm pt-0">
                  <CardHeader className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-t-lg py-2">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Users className="h-5 w-5" />
                      Group Animal Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Breed *</Label>
                          <Input
                            value={form.watch('animal_group.pack.breed')}
                            onChange={(e) =>
                              modifyPack('breed', e.target.value)
                            }
                          />
                          {extractPackErrors().breed && (
                            <p className="text-sm text-red-500">
                              {extractPackErrors().breed?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Group Name *</Label>
                          <Input
                            value={form.watch('animal_group.pack.name')}
                            onChange={(e) => modifyPack('name', e.target.value)}
                          />
                          {extractPackErrors().name && (
                            <p className="text-sm text-red-500">
                              {extractPackErrors().name?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Animal Type *</Label>
                          <Select
                            value={form.watch('animal_group.pack.type')}
                            onValueChange={(value) => modifyPack('type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Individual">
                                Individual
                              </SelectItem>
                              <SelectItem value="Group">Group</SelectItem>
                            </SelectContent>
                          </Select>
                          {extractPackErrors().type && (
                            <p className="text-sm text-red-500">
                              {extractPackErrors().type?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Gender *</Label>
                          <Select
                            value={form.watch('animal_group.pack.gender')}
                            onValueChange={(value) =>
                              modifyPack('gender', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="BOTH">Both</SelectItem>
                            </SelectContent>
                          </Select>
                          {extractPackErrors().gender && (
                            <p className="text-sm text-red-500">
                              {extractPackErrors().gender?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Starting Number *</Label>
                          <Input
                            type="number"
                            value={form.watch(
                              'animal_group.pack.starting_number'
                            )}
                            onChange={(e) =>
                              modifyPack(
                                'starting_number',
                                Number(e.target.value)
                              )
                            }
                          />
                          {extractPackErrors().starting_number && (
                            <p className="text-sm text-red-500">
                              {extractPackErrors().starting_number?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Average Age (months)</Label>
                          <Input
                            type="number"
                            value={
                              form.watch('animal_group.pack.average_age') || ''
                            }
                            onChange={(e) =>
                              modifyPack('average_age', Number(e.target.value))
                            }
                          />
                          {extractPackErrors().average_age && (
                            <p className="text-sm text-red-500">
                              {extractPackErrors().average_age?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Average Weight (kg)</Label>
                          <Input
                            type="number"
                            value={
                              form.watch('animal_group.pack.average_weight') ||
                              ''
                            }
                            onChange={(e) =>
                              modifyPack(
                                'average_weight',
                                Number(e.target.value)
                              )
                            }
                          />
                          {extractPackErrors().average_weight && (
                            <p className="text-sm text-red-500">
                              {extractPackErrors().average_weight?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Arrival Date</Label>
                          <Input
                            type="date"
                            value={
                              form.watch('animal_group.pack.arrival_date') || ''
                            }
                            onChange={(e) =>
                              modifyPack('arrival_date', e.target.value)
                            }
                          />
                          {extractPackErrors().arrival_date && (
                            <p className="text-sm text-red-500">
                              {extractPackErrors().arrival_date?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Birthday</Label>
                          <Input
                            type="date"
                            value={
                              form.watch('animal_group.pack.birthday') || ''
                            }
                            onChange={(e) =>
                              modifyPack('birthday', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Notes</Label>
                          <Input
                            value={form.watch('animal_group.pack.notes') || ''}
                            onChange={(e) =>
                              modifyPack('notes', e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              className="px-8 py-3 text-base border-gray-300 hover:bg-gray-50 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 py-3 text-base bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
