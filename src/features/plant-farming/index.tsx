'use client'
import {
  useCallback,
  useState,
  useRef,
  useMemo,
  useTransition,
  useEffect,
} from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
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
  Wheat,
  Navigation,
  CheckCircle,
  Droplets,
  CloudRain,
  ChevronsUpDown,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { SupplementRow } from './components/supplement-row'
import { UpdatableFieldList } from './components/updatable-field-list'
import { FIELD_LABELS } from '@/constants/plant-farming'
import type { PlantingProject } from '@/types/project'
import type {
  FieldRecord,
  UpdatableFieldKey,
  Supplement,
} from '@/types/plant-farming'
import { useUserLocation } from '@/hooks/use-user-location'
import { useAppDispatch } from '@/store/hooks'
import { createProject } from '@/store/actions/project'
import { cn } from '@/lib/utils'
import africanCountries from '@/data/countries.json'
import { plantingProjectSchema } from '@/schemas/plant-farming'
import z from 'zod'

const PlantFarmingView = () => {
  const { coordinates, error, permissionState, isLoading, requestLocation } =
    useUserLocation()

  const [countryOpen, setCountryOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)

  type PlantingProjectForm = z.infer<typeof plantingProjectSchema>

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
      is_active: true,
      location: {
        country: 'KE',
        city: '',
        coordinate: {
          latitude: 0,
          longitude: 0,
        },
      },
      soil: {
        type: 'Loam',
        nitrogen: 0,
        phosphorous: 0,
        potassium: 0,
        soil_ph: 0,
      },
      weather: {
        temperature: 0,
        humidity: 0,
        precipitation: 0,
        wind_speed: 0,
        solar_radiation: 0,
      },
      planting_event: {
        planting_date: '',
        area_size: '',
        area_size_unit: 'acres',
        end_date: '',
        notes: '',
        stage: 'Planning',
        type: '',
        name: '',
        species: [],
      },
    },
  })

  console.log(errors)

  const locationCountry = watch('location.country')
  const locationCity = watch('location.city')
  const soilType = watch('soil.type')

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'supplements' as any,
  })

  const [supplements, setSupplements] = useState<Supplement[]>([
    { id: Date.now(), name: '', quantity: '', price: '' },
  ])

  const [updatableFields, setUpdatableFields] = useState<
    Record<UpdatableFieldKey, FieldRecord[]>
  >({
    fertilitySpread: [],
    pest: [],
    diseases: [],
    management: [],
    species: [],
    harvest: [],
  })

  const [newFieldValue, setNewFieldValue] = useState('')
  const [selectedField, setSelectedField] =
    useState<UpdatableFieldKey>('fertilitySpread')

  const idCounterRef = useRef<number>(Date.now())
  const [isPending, startTransition] = useTransition()
  const dispatch = useAppDispatch()

  const fieldLabels = useMemo(() => FIELD_LABELS, [])
  const supplementsCount = useMemo(() => supplements.length, [supplements])

  const addSupplement = useCallback(() => {
    idCounterRef.current = idCounterRef.current + 1
    setSupplements((prev) => [
      ...prev,
      { id: idCounterRef.current, name: '', quantity: '', price: '' },
    ])
  }, [])

  const removeSupplement = useCallback((id: number) => {
    setSupplements((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const updateSupplement = useCallback(
    (id: number, field: keyof Supplement, value: string) => {
      setSupplements((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      )
    },
    []
  )

  const addFieldValue = useCallback(() => {
    if (!newFieldValue.trim()) return
    const payload: FieldRecord = {
      value: newFieldValue,
      timestamp: new Date().toISOString(),
    }
    startTransition(() => {
      setUpdatableFields((prev) => ({
        ...prev,
        [selectedField]: [...prev[selectedField], payload],
      }))
      setNewFieldValue('')
    })
  }, [newFieldValue, selectedField])

  const removeFieldValue = useCallback(
    (field: UpdatableFieldKey, index: number) => {
      setUpdatableFields((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }))
    },
    []
  )

  const supplementRows = useMemo(() => {
    return supplements.map((s) => (
      <SupplementRow
        key={s.id}
        supplement={s}
        onUpdate={updateSupplement}
        onRemove={removeSupplement}
        disabledRemove={supplementsCount === 1}
      />
    ))
  }, [supplements, updateSupplement, removeSupplement, supplementsCount])

  const onCancel = useCallback(() => {
    reset()
    setSupplements([{ id: Date.now(), name: '', quantity: '', price: '' }])
    setUpdatableFields({
      fertilitySpread: [],
      pest: [],
      diseases: [],
      management: [],
      species: [],
      harvest: [],
    })
  }, [reset])

  const onSave = handleSubmit((data) => {
    console.log(data)
    const completeProjectData: any = {
      ...data,
      // planting_event: {
      //   ...data.planting_event,
      //   species: updatableFields.species.map((field) => ({
      //     species: {
      //       variety: field.value.split(' - ')[0] || field.value,
      //       name: field.value.split(' - ')[1] || field.value,
      //       type: data.planting_event.type || 'Unknown',
      //       bloom_szn: 'Unknown',
      //       notes: '',
      //     },
      //     amount: '1',
      //     unit: 'unit',
      //   })),
      // },
      type: 'PlantingProject',
      is_active: true,
      weather: {
        temperature: 0,
        humidity: 0,
        precipitation: 0,
        wind_speed: 0,
        solar_radiation: 0,
      },
      name: '',
      created_date: '',
      status: 'Planning',
      location: {
        country: data.location?.country ?? '',
        city: data.location?.city ?? '',
        coordinate: {
          latitude: data.location?.coordinate?.latitude ?? 0,
          longitude: data.location?.coordinate?.longitude ?? 0,
        },
      },
    }

    dispatch(createProject(completeProjectData))
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
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
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

                <div className="space-y-2">
                  <Label htmlFor="cropType" className="text-sm font-semibold">
                    Crop Type
                  </Label>
                  <Input
                    id="cropType"
                    placeholder="e.g., Wheat, Corn, Rice"
                    className="h-11"
                    {...register('planting_event.type')}
                  />
                  {errors.planting_event?.type && (
                    <p className="text-sm text-red-500">
                      {errors.planting_event.type.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="areaSize" className="text-sm font-semibold">
                      Area Size
                    </Label>
                    <Input
                      id="areaSize"
                      placeholder="e.g., 25"
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
                    <Label
                      htmlFor="plantingDate"
                      className="text-sm font-semibold"
                    >
                      Area Unit
                    </Label>
                    <Select>
                      <SelectTrigger className="w-[100px] !h-11">
                        <SelectValue placeholder="Acres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="hectares">Acres</SelectItem>
                        <SelectItem value="sqm">Acres</SelectItem>
                        <SelectItem value="sqft">Acres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                      className="h-11 !w-[140px]"
                      {...register('planting_event.planting_date')}
                    />
                    {errors.planting_event?.planting_date && (
                      <p className="text-sm text-red-500">
                        {errors.planting_event.planting_date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="plantingDate"
                      className="text-sm font-semibold"
                    >
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      className="h-11 !w-[140px]"
                      {...register('planting_event.end_date')}
                    />
                    {errors.planting_event?.end_date && (
                      <p className="text-sm text-red-500">
                        {errors.planting_event.end_date.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaSize" className="text-sm font-semibold">
                      Notes
                    </Label>
                    <Input
                      id="notes"
                      placeholder="notes..."
                      className="h-11"
                      {...register('planting_event.notes')}
                    />
                    {errors.planting_event?.notes && (
                      <p className="text-sm text-red-500">
                        {errors.planting_event.notes.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="plantingStage"
                      className="text-sm font-semibold"
                    >
                      Stage
                    </Label>
                    <Select>
                      <SelectTrigger className="w-[100px] !h-11">
                        <SelectValue placeholder="Stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Planting">Planting</SelectItem>
                        <SelectItem value="Growing">Growing</SelectItem>
                        <SelectItem value="Harvesting">Harvesting</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg py-2">
                <CardTitle className="text-xl">Required Supplements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {supplementRows}
                <Button
                  type="button"
                  onClick={addSupplement}
                  variant="outline"
                  className="w-full h-11 border-2 border-dashed border-orange-300 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplement
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white rounded-t-lg py-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Droplets className="h-6 w-6" />
                  Soil Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="soilType" className="text-sm font-semibold">
                    Soil Type
                  </Label>
                  <Controller
                    name="soil.type"
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
                          <SelectItem value="Sandy">Sandy</SelectItem>
                          <SelectItem value="Clay">Clay</SelectItem>
                          <SelectItem value="Loam">Loam</SelectItem>
                          <SelectItem value="Silty">Silty</SelectItem>
                          <SelectItem value="Peaty">Peaty</SelectItem>
                          <SelectItem value="Chalky">Chalky</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.soil?.type && (
                    <p className="text-sm text-red-500">
                      {errors.soil.type.message}
                    </p>
                  )}
                </div>

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

            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-lg py-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CloudRain className="h-6 w-6" />
                  Weather Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="temperature"
                      className="text-sm font-semibold"
                    >
                      Temperature (°C)
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      placeholder="0"
                      className="h-11"
                      {...register('weather.temperature', {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.weather?.temperature && (
                      <p className="text-sm text-red-500">
                        {errors.weather.temperature.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity" className="text-sm font-semibold">
                      Humidity (%)
                    </Label>
                    <Input
                      id="humidity"
                      type="number"
                      placeholder="0"
                      className="h-11"
                      {...register('weather.humidity', { valueAsNumber: true })}
                    />
                    {errors.weather?.humidity && (
                      <p className="text-sm text-red-500">
                        {errors.weather.humidity.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="precipitation"
                      className="text-sm font-semibold"
                    >
                      Precipitation (mm)
                    </Label>
                    <Input
                      id="precipitation"
                      type="number"
                      placeholder="0"
                      className="h-11"
                      {...register('weather.precipitation', {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.weather?.precipitation && (
                      <p className="text-sm text-red-500">
                        {errors.weather.precipitation.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="windSpeed"
                      className="text-sm font-semibold"
                    >
                      Wind Speed (km/h)
                    </Label>
                    <Input
                      id="windSpeed"
                      type="number"
                      placeholder="0"
                      className="h-11"
                      {...register('weather.wind_speed', {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.weather?.wind_speed && (
                      <p className="text-sm text-red-500">
                        {errors.weather.wind_speed.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="solarRadiation"
                    className="text-sm font-semibold"
                  >
                    Solar Radiation (W/m²)
                  </Label>
                  <Input
                    id="solarRadiation"
                    type="number"
                    placeholder="0"
                    className="h-11"
                    {...register('weather.solar_radiation', {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.weather?.solar_radiation && (
                    <p className="text-sm text-red-500">
                      {errors.weather.solar_radiation.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-700 to-teal-500 text-white rounded-t-lg py-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Wheat className="h-6 w-6" />
                Plant Event Records
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold">Field Type</Label>
                  <Select
                    value={selectedField}
                    onValueChange={(value) =>
                      setSelectedField(value as UpdatableFieldKey)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fieldLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-2 space-y-2">
                  <Label className="text-sm font-semibold">
                    Add New Record
                  </Label>
                  <Input
                    placeholder={`Enter ${fieldLabels[
                      selectedField
                    ].toLowerCase()} details`}
                    className="h-11"
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addFieldValue}
                  disabled={isPending}
                  className="h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <UpdatableFieldList
                updatableFields={updatableFields}
                onRemove={removeFieldValue}
                fieldLabels={fieldLabels}
              />
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

export default PlantFarmingView
