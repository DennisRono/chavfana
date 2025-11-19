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
import { Beef, CheckCircle, Navigation, Users } from 'lucide-react'
import { IndividualAnimalRow } from './components/individual-animal-row'
import { GroupAnimalForm } from './components/group-animal-form'
import { toast } from 'sonner'
import { createProject } from '@/store/actions/project'
import { useAppDispatch } from '@/store/hooks'
import { AppDispatch } from '@/store/store'
import { useCallback, useEffect, useState } from 'react'
import africanCountries from '@/data/countries.json'
import { useUserLocation } from '@/hooks/use-user-location'
import {
  AnimalProjectForm,
  animalProjectSchema,
} from '@/schemas/animal-farming'
import { useRouter } from 'next/navigation'
import {
  AnimalGroup,
  AnimalKeepingProject,
  GroupAnimal,
  IndividualAnimal,
  ProjectData,
} from '@/types/project'

export default function AnimalFarmingForm() {
  const [formType, setFormType] = useState<'Individual' | 'Group'>('Individual')
  const [isLoading, setIsLoading] = useState(false)
  const {
    coordinates,
    error,
    permissionState,
    isLoading: locationLoading,
    requestLocation,
  } = useUserLocation()
  const dispatch = useAppDispatch<AppDispatch>()
  const router = useRouter()

  const form = useForm<AnimalProjectForm>({
    resolver: zodResolver(animalProjectSchema),
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
        animals: {
          tag: '',
          breed: '',
          name: '',
          arrival_date: new Date().toISOString().split('T')[0],
          birthday: '',
          type: '',
          gender: 'MALE' as const,
          weight: 0,
          age: 0,
          notes: '',
        },
      },
    },
  })

  useEffect(() => {
    if (permissionState === 'granted' && coordinates) {
      form.setValue('location.coordinate.latitude', coordinates.latitude)
      form.setValue('location.coordinate.longitude', coordinates.longitude)
    }
  }, [permissionState, coordinates, form])

  const handleLocationRequest = useCallback(async () => {
    try {
      await requestLocation()
      if (coordinates) {
        toast.success('Location accessed successfully!', {
          description: `Coordinates: ${coordinates.latitude.toFixed(
            4
          )}, ${coordinates.longitude.toFixed(4)}`,
        })
      }
    } catch (err) {
      toast.error('Failed to access location', {
        description:
          String(error) ||
          'Please check your browser permissions and try again.',
      })
    }
  }, [requestLocation, coordinates, error])

  const onSubmit = async (data: AnimalProjectForm) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        type: 'AnimalKeepingProject',
        created_date:
          data.created_date || new Date().toISOString().split('T')[0],

        animal_group: data.animal_group,
      }

      const result = await dispatch(
        createProject(submitData as ProjectData)
      ).unwrap()
      toast.success('Success', {
        description: 'Animal project created successfully!',
      })
      router.push(`/project/${result.id}`)
    } catch (error: any) {
      toast.error('Error', {
        description:
          error?.message || 'Failed to create project. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (formType === 'Individual') {
      form.setValue('animal_group.type', 'Individual')

      form.setValue('animal_group.animals', {
        tag: '',
        breed: '',
        name: '',
        arrival_date: new Date().toISOString().split('T')[0],
        birthday: '',
        type: '',
        gender: 'MALE',
        weight: 0,
        age: 0,
        notes: '',
        non_field_errors: [],
      })
    } else {
      form.setValue('animal_group.type', 'Group')
      form.setValue('animal_group.animals', {
        breed: '',
        name: '',
        arrival_date: new Date().toISOString().split('T')[0],
        birthday: '',
        type: '',
        gender: 'MALE',
        average_weight: 0,
        average_age: 0,
        starting_number: 0,
        notes: '',
        non_field_errors: [],
      })
    }
  }, [formType, form])

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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Information Card - remains the same */}
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
                  <div className="space-y-2 ">
                    <Label>Status</Label>
                    <Select
                      value={form.watch('status')}
                      onValueChange={(value) =>
                        form.setValue('status', value as any)
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
                  <div className="space-y-2 ">
                    <Label>Country</Label>
                    <Select
                      value={form.watch('location.country')}
                      onValueChange={(value) =>
                        form.setValue('location.country', value as any)
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
                  <div className="space-y-2 ">
                    <Label>City</Label>
                    <Select
                      value={form.watch('location.city')}
                      onValueChange={(value) =>
                        form.setValue('location.city', value as any)
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
                            placeholder="e.g., 40.7128"
                            className="h-11 font-mono"
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
                            placeholder="e.g., -74.0060"
                            className="h-11 font-mono"
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
                          onClick={handleLocationRequest}
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
            value={formType}
            onValueChange={(value) => {
              setFormType(value as 'Individual' | 'Group')
            }}
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
                  <IndividualAnimalRow form={form} formType={formType} />
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
                        {form.formState.errors.animal_group?.group_name && (
                          <p className="text-sm text-red-500">
                            {
                              form.formState.errors.animal_group.group_name
                                .message
                            }
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Housing Type</Label>
                        <Select
                          value={form.watch('animal_group.housing')}
                          onValueChange={(value) =>
                            form.setValue('animal_group.housing', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BARN">Barn</SelectItem>
                            <SelectItem value="CAGE">Cage</SelectItem>
                            <SelectItem value="FREE_RANGE">
                              Free Range
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Group Created Date</Label>
                        <Input
                          type="date"
                          {...form.register('animal_group.group_created_date')}
                        />
                        {form.formState.errors.animal_group
                          ?.group_created_date && (
                          <p className="text-sm text-red-500">
                            {
                              form.formState.errors.animal_group
                                .group_created_date.message
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
                    <GroupAnimalForm form={form} formType={formType} />
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 py-3 text-base bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
