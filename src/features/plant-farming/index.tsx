'use client'

import { useCallback, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Plus,
  MapPin,
  Navigation,
  CheckCircle,
  Droplets,
  ChevronsUpDown,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { SpeciesRow } from './components/species-row'
import { useUserLocation } from '@/hooks/use-user-location'
import { useAppDispatch } from '@/store/hooks'
import { createProject } from '@/store/actions/project'
import { cn } from '@/lib/utils'
import africanCountries from '@/data/countries.json'
import {
  plantingProjectSchema,
  type PlantingProjectForm,
} from '@/schemas/plant-farming'

const PlantingEventForm = () => {
  const { coordinates, error, permissionState, isLoading, requestLocation } =
    useUserLocation()
  const [countryOpen, setCountryOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const dispatch = useAppDispatch()

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PlantingProjectForm>({
    resolver: zodResolver(plantingProjectSchema),
    defaultValues: {
      name: '',
      created_date: new Date().toISOString().split('T')[0],
      type: 'PlantingProject',
      status: 'Planning',
      location: {
        country: 'KE',
        city: '',
        coordinate: { latitude: 0, longitude: 0 },
      },
      planting_event: {
        planting_date: '',
        area_size: '',
        area_size_unit: 'ACRE',
        end_date: '',
        notes: '',
        stage: '',
        type: '',
        name: '',
        species: [
          {
            species: {
              variety: '',
              name: '',
              type: '',
              bloom_szn: '',
              notes: '',
            },
            amount: '',
            unit: 'GRAM',
          },
        ],
      },
    },
  })

  const locationCountry = watch('location.country')
  const species = watch('planting_event.species') || []

  const addSpecies = useCallback(() => {
    const currentSpecies = species || []
    setValue('planting_event.species', [
      ...currentSpecies,
      {
        species: { variety: '', name: '', type: '', bloom_szn: '', notes: '' },
        amount: '',
        unit: 'GRAM',
      },
    ])
  }, [species, setValue])

  const removeSpecies = useCallback(
    (index: number) => {
      const currentSpecies = species || []
      setValue(
        'planting_event.species',
        currentSpecies.filter((_, i) => i !== index)
      )
    },
    [species, setValue]
  )

  const updateSpecies = useCallback(
    (index: number, field: string, value: string) => {
      const currentSpecies = [...(species || [])]
      const fieldParts = field.split('.')
      if (fieldParts.length === 2 && fieldParts[0] === 'species') {
        currentSpecies[index] = {
          ...currentSpecies[index],
          species: {
            ...currentSpecies[index].species,
            [fieldParts[1]]: value,
          },
        }
      } else {
        currentSpecies[index] = {
          ...currentSpecies[index],
          [field]: value,
        }
      }
      setValue('planting_event.species', currentSpecies)
    },
    [species, setValue]
  )

  const onCancel = useCallback(() => {
    reset()
  }, [reset])

  const onSave = handleSubmit((data: any) => {
    console.log('Form Data:', data)
    dispatch(createProject(data))
    toast.success('Project created successfully!')
  })

  useEffect(() => {
    if (permissionState === 'granted' && coordinates) {
      setValue('location.coordinate.latitude', coordinates.latitude)
      setValue('location.coordinate.longitude', coordinates.longitude)
    }
  }, [permissionState, coordinates, setValue])

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

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 py-8">
        <form onSubmit={onSave}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm !pt-0">
              <CardHeader className="bg-gradient-to-r from-green-700 to-emerald-500 text-white rounded-t-lg py-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-6 w-6" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="projectName"
                    className="text-sm font-semibold"
                  >
                    Project Name
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Wheat Field A"
                    className="h-11"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-semibold">
                      Country
                    </Label>
                    <Controller
                      name="location.country"
                      control={control}
                      render={({ field }) => (
                        <Popover
                          open={countryOpen}
                          onOpenChange={setCountryOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={countryOpen}
                              className="w-full justify-between h-11 bg-transparent"
                            >
                              {field.value
                                ? `${
                                    africanCountries.find(
                                      (country) => country.code === field.value
                                    )?.name
                                  } (${field.value})`
                                : 'Select country...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search country..." />
                              <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {africanCountries.map((country) => (
                                    <CommandItem
                                      key={country.code}
                                      value={`${country.name} ${country.code}`}
                                      onSelect={() => {
                                        field.onChange(country.code)
                                        setCountryOpen(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === country.code
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {country.name} ({country.code})
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.location?.country && (
                      <p className="text-sm text-red-500">
                        {errors.location.country.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-semibold">
                      City
                    </Label>
                    <Controller
                      name="location.city"
                      control={control}
                      render={({ field }) => (
                        <Popover open={cityOpen} onOpenChange={setCityOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={cityOpen}
                              className="w-full justify-between h-11 bg-transparent"
                              disabled={!locationCountry}
                            >
                              {field.value || 'Select city...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search city..." />
                              <CommandList>
                                <CommandEmpty>No city found.</CommandEmpty>
                                <CommandGroup>
                                  {africanCountries
                                    .find(
                                      (country) =>
                                        country.code === locationCountry
                                    )
                                    ?.cities.map((city) => (
                                      <CommandItem
                                        key={city}
                                        value={city}
                                        onSelect={() => {
                                          field.onChange(city)
                                          setCityOpen(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            field.value === city
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {city}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.location?.city && (
                      <p className="text-sm text-red-500">
                        {errors.location.city.message}
                      </p>
                    )}
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
                            {...register('location.coordinate.latitude', {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.location?.coordinate?.latitude && (
                            <p className="text-sm text-red-500">
                              {errors.location.coordinate.latitude.message}
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
                            {...register('location.coordinate.longitude', {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.location?.coordinate?.longitude && (
                            <p className="text-sm text-red-500">
                              {errors.location.coordinate.longitude.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {(permissionState === 'prompt' ||
                        permissionState === 'denied') && (
                        <Button
                          type="button"
                          onClick={handleLocationRequest}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          {isLoading
                            ? 'Requesting Location...'
                            : 'Use Current Location'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm !pt-0">
              <CardHeader className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white rounded-t-lg py-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Droplets className="h-6 w-6" />
                  Soil Information (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen" className="text-sm font-semibold">
                      Nitrogen (N)
                    </Label>
                    <Input
                      id="nitrogen"
                      type="number"
                      placeholder="0"
                      className="h-11"
                      {...register('soil.nitrogen', { valueAsNumber: true })}
                    />
                    {errors.soil?.nitrogen && (
                      <p className="text-sm text-red-500">
                        {errors.soil.nitrogen.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phosphorous"
                      className="text-sm font-semibold"
                    >
                      Phosphorous (P)
                    </Label>
                    <Input
                      id="phosphorous"
                      type="number"
                      placeholder="0"
                      className="h-11"
                      {...register('soil.phosphorous', { valueAsNumber: true })}
                    />
                    {errors.soil?.phosphorous && (
                      <p className="text-sm text-red-500">
                        {errors.soil.phosphorous.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="potassium"
                      className="text-sm font-semibold"
                    >
                      Potassium (K)
                    </Label>
                    <Input
                      id="potassium"
                      type="number"
                      placeholder="0"
                      className="h-11"
                      {...register('soil.potassium', { valueAsNumber: true })}
                    />
                    {errors.soil?.potassium && (
                      <p className="text-sm text-red-500">
                        {errors.soil.potassium.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilPh" className="text-sm font-semibold">
                      Soil pH
                    </Label>
                    <Input
                      id="soilPh"
                      type="number"
                      step="0.1"
                      placeholder="0"
                      className="h-11"
                      {...register('soil.soil_ph', { valueAsNumber: true })}
                    />
                    {errors.soil?.soil_ph && (
                      <p className="text-sm text-red-500">
                        {errors.soil.soil_ph.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm !pt-0">
            <CardHeader className="bg-gradient-to-r from-emerald-700 to-teal-500 text-white rounded-t-lg py-2">
              <CardTitle className="text-xl">Planting Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName" className="text-sm font-semibold">
                    Event Name
                  </Label>
                  <Input
                    id="eventName"
                    placeholder="e.g., event1"
                    className="h-11"
                    {...register('planting_event.name')}
                  />
                  {errors.planting_event?.name && (
                    <p className="text-sm text-red-500">
                      {errors.planting_event.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cropType" className="text-sm font-semibold">
                    Crop Type
                  </Label>
                  <Input
                    id="cropType"
                    placeholder="e.g., vegetable"
                    className="h-11"
                    {...register('planting_event.type')}
                  />
                  {errors.planting_event?.type && (
                    <p className="text-sm text-red-500">
                      {errors.planting_event.type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="areaSize" className="text-sm font-semibold">
                    Area Size
                  </Label>
                  <Input
                    id="areaSize"
                    placeholder="e.g., 13"
                    className="h-11"
                    {...register('planting_event.area_size')}
                  />
                  {errors.planting_event?.area_size && (
                    <p className="text-sm text-red-500">
                      {errors.planting_event.area_size.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="areaUnit" className="text-sm font-semibold">
                    Area Unit
                  </Label>
                  <Controller
                    name="planting_event.area_size_unit"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SQUARE_FEET">
                            Square Feet
                          </SelectItem>
                          <SelectItem value="SQUARE_YARD">
                            Square Yard
                          </SelectItem>
                          <SelectItem value="SQUARE_METER">
                            Square Meter
                          </SelectItem>
                          <SelectItem value="ACRE">Acre</SelectItem>
                          <SelectItem value="HECTARE">Hectare</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.planting_event?.area_size_unit && (
                    <p className="text-sm text-red-500">
                      {errors.planting_event.area_size_unit.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="plantingDate"
                    className="text-sm font-semibold"
                  >
                    Planting Date
                  </Label>
                  <Input
                    id="plantingDate"
                    type="date"
                    className="h-11"
                    {...register('planting_event.planting_date')}
                  />
                  {errors.planting_event?.planting_date && (
                    <p className="text-sm text-red-500">
                      {errors.planting_event.planting_date.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-semibold">
                    End Date (Optional)
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    className="h-11"
                    {...register('planting_event.end_date')}
                  />
                  {errors.planting_event?.end_date && (
                    <p className="text-sm text-red-500">
                      {errors.planting_event.end_date.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stage" className="text-sm font-semibold">
                    Stage
                  </Label>
                  <Input
                    id="stage"
                    placeholder="e.g., blossom"
                    className="h-11"
                    {...register('planting_event.stage')}
                  />
                  {errors.planting_event?.stage && (
                    <p className="text-sm text-red-500">
                      {errors.planting_event.stage.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-semibold">
                    Notes (Optional)
                  </Label>
                  <Input
                    id="notes"
                    placeholder="Additional notes..."
                    className="h-11"
                    {...register('planting_event.notes')}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Species</h3>
                  <Button
                    type="button"
                    onClick={addSpecies}
                    variant="outline"
                    size="sm"
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-400 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Species
                  </Button>
                </div>
                {species.map((sp, index) => (
                  <SpeciesRow
                    key={index}
                    index={index}
                    species={sp}
                    onUpdate={updateSpecies}
                    onRemove={removeSpecies}
                    disabledRemove={species.length === 1}
                    errors={errors.planting_event?.species?.[index]}
                  />
                ))}
                {errors.planting_event?.species &&
                  typeof errors.planting_event.species === 'object' &&
                  'message' in errors.planting_event.species && (
                    <p className="text-sm text-red-500">
                      {errors.planting_event.species.message as string}
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-11 px-8 border-2 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 px-8 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-700 hover:to-emerald-700"
            >
              Save Project
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default PlantingEventForm
