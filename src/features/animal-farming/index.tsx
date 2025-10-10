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
import { Beef, Users } from 'lucide-react'
import {
  animalProjectSchema,
  type AnimalProjectForm,
} from '@/schemas/animal-farming'
import { IndividualAnimalRow } from './components/individual-animal-row'
import { GroupAnimalForm } from './components/group-animal-form'
import { toast } from 'sonner'
import { createProject } from '@/store/actions/project'
import { useAppDispatch } from '@/store/hooks'

export default function AnimalFarmingForm() {
  const dispatch = useAppDispatch()
  const form = useForm<AnimalProjectForm>({
    resolver: zodResolver(animalProjectSchema),
    defaultValues: {
      name: '',
      created_date: new Date().toISOString().split('T')[0],
      type: 'AnimalKeepingProject',
      status: 'Active',
      location: {
        country: '',
        city: '',
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
          gender: 'MALE',
          weight: 0,
          age: '',
          notes: '',
        },
      },
    },
  })

  const onSubmit = (data: AnimalProjectForm) => {
    dispatch(createProject(data))
    toast.success('Animal project created successfully!')
  }

  const handleTypeChange = (type: 'Individual' | 'Group') => {
    if (type === 'Individual') {
      form.setValue('animal_group', {
        type: 'Individual',
        group_name: form.watch('animal_group.group_name') || '',
        housing: form.watch('animal_group.housing') || 'BARN',
        group_created_date:
          form.watch('animal_group.group_created_date') ||
          new Date().toISOString().split('T')[0],
        animals: {
          tag: '',
          breed: '',
          name: '',
          arrival_date: new Date().toISOString().split('T')[0],
          birthday: '',
          type: '',
          gender: 'MALE',
          weight: 0,
          age: '',
          notes: '',
        },
      })
    } else {
      form.setValue('animal_group', {
        type: 'Group',
        group_name: form.watch('animal_group.group_name') || '',
        housing: form.watch('animal_group.housing') || 'BARN',
        group_created_date:
          form.watch('animal_group.group_created_date') ||
          new Date().toISOString().split('T')[0],
        animals: {
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
        },
      })
    }
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
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
                <div className="space-y-2">
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
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Country Code</Label>
                  <Input
                    placeholder="KE"
                    maxLength={2}
                    {...form.register('location.country')}
                  />
                  {form.formState.errors.location?.country && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.location.country.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    placeholder="Nairobi"
                    {...form.register('location.city')}
                  />
                  {form.formState.errors.location?.city && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.location.city.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="-1.5246642"
                    {...form.register('location.coordinate.latitude', {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.location?.coordinate?.latitude && (
                    <p className="text-sm text-red-500">
                      {
                        form.formState.errors.location.coordinate.latitude
                          .message
                      }
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="37.2650979"
                    {...form.register('location.coordinate.longitude', {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.location?.coordinate?.longitude && (
                    <p className="text-sm text-red-500">
                      {
                        form.formState.errors.location.coordinate.longitude
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-t-lg py-2">
              <CardTitle className="text-xl">
                Soil Information (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phosphorous</Label>
                  <Input
                    type="number"
                    placeholder="40"
                    {...form.register('soil.phosphorous', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Potassium</Label>
                  <Input
                    type="number"
                    placeholder="40"
                    {...form.register('soil.potassium', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nitrogen</Label>
                  <Input
                    type="number"
                    placeholder="40"
                    {...form.register('soil.nitrogen', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Soil pH</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="5"
                    {...form.register('soil.soil_ph', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs
            value={form.watch('animal_group.type')}
            onValueChange={(value) =>
              handleTypeChange(value as 'Individual' | 'Group')
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
                  <IndividualAnimalRow form={form} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Group">
              <div className="space-y-4">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
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
                            <SelectItem value="PASTURE">Pasture</SelectItem>
                            <SelectItem value="CAGE">Cage</SelectItem>
                            <SelectItem value="PEN">Pen</SelectItem>
                            <SelectItem value="COOP">Coop</SelectItem>
                            <SelectItem value="STABLE">Stable</SelectItem>
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
                    <GroupAnimalForm form={form} />
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 py-3 text-base bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-lg"
            >
              Save Project
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
