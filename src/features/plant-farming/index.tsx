'use client'
import {
  useCallback,
  useReducer,
  useState,
  useRef,
  useMemo,
  useTransition,
  useEffect,
} from 'react'
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
import type { PlantingProject, PlantSpecies } from '@/types/project'
import type {
  LandDetails,
  FieldRecord,
  UpdatableFieldKey,
  Supplement,
  SupplementsAction,
  LandAction,
} from '@/types/plant-farming'
import { useUserLocation } from '@/hooks/use-user-location'
import { useAppDispatch } from '@/store/hooks'
import { createProject } from '@/store/actions/project'
import { cn } from '@/lib/utils'
import africanCountries from '@/data/countries.json'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type PermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported'

const PlantFarmingView = () => {
  const { coordinates, error, permissionState, isLoading, requestLocation } =
    useUserLocation()

  const [countryOpen, setCountryOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)

  const [projectData, setProjectData] = useState<DeepPartial<PlantingProject>>({
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
  })

  const [landDetails, dispatchLand] = useReducer(
    landReducer,
    initialLandDetails
  )

  const [supplements, dispatchSupplements] = useReducer(supplementsReducer, [
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
    dispatchSupplements({ type: 'add', payload: { id: idCounterRef.current } })
  }, [])

  const removeSupplement = useCallback((id: number) => {
    dispatchSupplements({ type: 'remove', payload: { id } })
  }, [])

  const updateSupplement = useCallback(
    (id: number, field: keyof Supplement, value: string) => {
      dispatchSupplements({ type: 'update', payload: { id, field, value } })
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
    setProjectData({
      name: '',
      created_date: new Date().toISOString().split('T')[0],
      type: 'PlantingProject',
      status: 'Planning',
      is_active: true,
      location: {
        country: '',
        city: '',
        coordinate: { latitude: 0, longitude: 0 },
      },
      soil: {
        type: 'Sandy',
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
    })
    dispatchLand({ type: 'reset' })
    dispatchSupplements({
      type: 'set',
      payload: [{ id: Date.now(), name: '', quantity: '', price: '' }],
    })
    setUpdatableFields({
      fertilitySpread: [],
      pest: [],
      diseases: [],
      management: [],
      species: [],
      harvest: [],
    })
  }, [])

  const onSave = useCallback(() => {
    const completeProjectData: PlantingProject = {
      name: projectData.name || 'Untitled Plant Project',
      created_date:
        projectData.created_date || new Date().toISOString().split('T')[0],
      type: 'PlantingProject',
      status: projectData.status || 'Planning',
      is_active: projectData.is_active ?? true,
      location: {
        country: projectData.location?.country ?? '',
        city: projectData.location?.city ?? '',
        coordinate: {
          latitude: projectData.location?.coordinate?.latitude ?? 0,
          longitude: projectData.location?.coordinate?.longitude ?? 0,
        },
      },
      soil: {
        type: projectData.soil?.type ?? 'Sandy',
        nitrogen: projectData.soil?.nitrogen ?? 0,
        phosphorous: projectData.soil?.phosphorous ?? 0,
        potassium: projectData.soil?.potassium ?? 0,
        soil_ph: projectData.soil?.soil_ph ?? 0,
      },
      weather: {
        temperature: projectData.weather?.temperature ?? 0,
        humidity: projectData.weather?.humidity ?? 0,
        precipitation: projectData.weather?.precipitation ?? 0,
        wind_speed: projectData.weather?.wind_speed ?? 0,
        solar_radiation: projectData.weather?.solar_radiation ?? 0,
      },
      planting_event: {
        planting_date:
          projectData.planting_event?.planting_date ??
          new Date().toISOString().split('T')[0],
        area_size: projectData.planting_event?.area_size ?? landDetails.size,
        area_size_unit: projectData.planting_event?.area_size_unit ?? 'acres',
        end_date: projectData.planting_event?.end_date ?? '',
        notes: projectData.planting_event?.notes ?? '',
        stage: projectData.planting_event?.stage ?? 'Planning',
        type: projectData.planting_event?.type ?? landDetails.cropPlanted,
        name:
          projectData.planting_event?.name ??
          projectData.name ??
          'Default Event',
        species: updatableFields.species.map((field) => ({
          species: {
            variety: field.value.split(' - ')[0] || field.value,
            name: field.value.split(' - ')[1] || field.value,
            type: landDetails.cropPlanted || 'Unknown',
            bloom_szn: 'Unknown',
            notes: '',
          },
          amount: '1',
          unit: 'unit',
        })) as PlantSpecies[],
      },
    }

    dispatch(createProject(completeProjectData))
  }, [projectData, landDetails, updatableFields, dispatch])

  useEffect(() => {
    if (permissionState === 'granted' && coordinates) {
      setProjectData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinate: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
        },
      }))
    }
  }, [permissionState, coordinates])

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
                <Label htmlFor="projectName" className="text-sm font-semibold">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Wheat Field A"
                  className="h-11"
                  value={projectData.name || ''}
                  onChange={(e) =>
                    setProjectData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-semibold">
                    Country
                  </Label>
                  <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={countryOpen}
                        className="w-full justify-between h-11 bg-transparent"
                      >
                        {projectData?.location?.country
                          ? `${
                              africanCountries.find(
                                (country) =>
                                  country.code ===
                                  projectData?.location?.country
                              )?.name
                            } (${projectData?.location?.country})`
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
                                  setProjectData((prev) => ({
                                    ...prev,
                                    location: {
                                      ...prev.location,
                                      country: country.code,
                                      city: prev.location?.city || '',
                                      coordinate: prev.location?.coordinate || {
                                        latitude: 0,
                                        longitude: 0,
                                      },
                                    },
                                  }))

                                  setCountryOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    projectData?.location?.country ===
                                      country.code
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold">
                    City
                  </Label>
                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cityOpen}
                        className="w-full justify-between h-11 bg-transparent"
                        disabled={!projectData?.location?.country}
                      >
                        {projectData.location?.city || 'Select city...'}
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
                                  country.code === projectData.location?.country
                              )
                              ?.cities.map((city) => (
                                <CommandItem
                                  key={city}
                                  value={city}
                                  onSelect={(e) =>
                                    setProjectData((prev) => ({
                                      ...prev,
                                      location: {
                                        ...prev.location,
                                        city: city,
                                        country: prev.location?.country || '',
                                        coordinate: prev.location
                                          ?.coordinate || {
                                          latitude: 0,
                                          longitude: 0,
                                        },
                                      },
                                    }))
                                  }
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      projectData.location?.city === city
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
                      <span className="text-xs font-medium">Auto-detected</span>
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
                          value={
                            projectData.location?.coordinate?.latitude?.toString() ||
                            ''
                          }
                          onChange={(e) =>
                            setProjectData((prev) => ({
                              ...prev,
                              location: {
                                ...prev.location,
                                coordinate: {
                                  ...prev.location?.coordinate,
                                  latitude:
                                    Number.parseFloat(e.target.value) || 0,
                                  longitude:
                                    prev.location?.coordinate?.longitude || 0,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude" className="text-sm">
                          Longitude
                        </Label>
                        <Input
                          id="longitude"
                          placeholder="e.g., -74.0060"
                          className="h-11 font-mono"
                          value={
                            projectData.location?.coordinate?.longitude?.toString() ||
                            ''
                          }
                          onChange={(e) =>
                            setProjectData((prev) => ({
                              ...prev,
                              location: {
                                ...prev.location,
                                coordinate: {
                                  ...prev.location?.coordinate,
                                  longitude:
                                    Number.parseFloat(e.target.value) || 0,
                                  latitude:
                                    prev.location?.coordinate?.latitude || 0,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {(permissionState === 'prompt' ||
                      permissionState === 'denied') && (
                      <Button
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
                  value={projectData.planting_event?.type || ''}
                  onChange={(e) =>
                    setProjectData((prev) => ({
                      ...prev,
                      planting_event: {
                        ...prev.planting_event,
                        type: e.target.value,
                      },
                    }))
                  }
                />
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
                    value={projectData.planting_event?.area_size || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        planting_event: {
                          ...prev.planting_event,
                          area_size: e.target.value,
                        },
                      }))
                    }
                  />
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
                    className="h-11"
                    value={projectData.planting_event?.planting_date || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        planting_event: {
                          ...prev.planting_event,
                          planting_date: e.target.value,
                        },
                      }))
                    }
                  />
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
                <Select
                  value={projectData.soil?.type || 'Loam'}
                  onValueChange={(value) =>
                    setProjectData((prev) => ({
                      ...prev,
                      soil: {
                        ...prev.soil,
                        type: value,
                      },
                    }))
                  }
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
                    value={projectData.soil?.nitrogen || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        soil: {
                          ...prev.soil,
                          nitrogen: Number.parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
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
                    value={projectData.soil?.phosphorous || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        soil: {
                          ...prev.soil,
                          phosphorous: Number.parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="potassium" className="text-sm font-semibold">
                    Potassium (K)
                  </Label>
                  <Input
                    id="potassium"
                    type="number"
                    placeholder="0"
                    className="h-11"
                    value={projectData.soil?.potassium || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        soil: {
                          ...prev.soil,
                          potassium: Number.parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
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
                    value={projectData.soil?.soil_ph || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        soil: {
                          ...prev.soil,
                          soil_ph: Number.parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
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
                    value={projectData.weather?.temperature || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        weather: {
                          ...prev.weather,
                          temperature: Number.parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
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
                    value={projectData.weather?.humidity || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        weather: {
                          ...prev.weather,
                          humidity: Number.parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                  />
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
                    value={projectData.weather?.precipitation || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        weather: {
                          ...prev.weather,
                          precipitation: Number.parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windSpeed" className="text-sm font-semibold">
                    Wind Speed (km/h)
                  </Label>
                  <Input
                    id="windSpeed"
                    type="number"
                    placeholder="0"
                    className="h-11"
                    value={projectData.weather?.wind_speed || ''}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        weather: {
                          ...prev.weather,
                          wind_speed: Number.parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
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
                  value={projectData.weather?.solar_radiation || ''}
                  onChange={(e) =>
                    setProjectData((prev) => ({
                      ...prev,
                      weather: {
                        ...prev.weather,
                        solar_radiation: Number.parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
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
                <Label className="text-sm font-semibold">Add New Record</Label>
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
            variant="outline"
            onClick={onCancel}
            className="h-11 px-8 border-2 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="h-11 px-8 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-700 hover:to-emerald-700"
          >
            Save Project
          </Button>
        </div>
      </main>
    </div>
  )
}

const initialLandDetails: LandDetails = {
  projectName: '',
  location: '',
  longitude: '',
  latitude: '',
  soilType: '',
  cropPlanted: '',
  size: '',
  plantingDate: '',
}

function landReducer(state: LandDetails, action: LandAction): LandDetails {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.payload }
    case 'reset':
      return action.payload ?? initialLandDetails
    default:
      return state
  }
}

function supplementsReducer(
  state: Supplement[],
  action: SupplementsAction
): Supplement[] {
  switch (action.type) {
    case 'add': {
      const id = action.payload?.id ?? Date.now()
      return [...state, { id, name: '', quantity: '', price: '' }]
    }
    case 'remove':
      return state.filter((s) => s.id !== action.payload.id)
    case 'update':
      return state.map((s) =>
        s.id === action.payload.id
          ? { ...s, [action.payload.field]: action.payload.value }
          : s
      )
    case 'set':
      return action.payload
    default:
      return state
  }
}

export default PlantFarmingView
