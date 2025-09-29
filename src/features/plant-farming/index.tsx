'use client'
import {
  useCallback,
  useReducer,
  useState,
  useRef,
  useMemo,
  useTransition,
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
import { Plus, MapPin, Wheat } from 'lucide-react'
import { SupplementRow } from './components/supplement-row'
import { UpdatableFieldList } from './components/updatable-field-list'
import { useDebouncedCallback } from '@/hooks/use-debounced'
import { FIELD_LABELS } from '@/constants/plant-farming'
import type {
  LandDetails,
  FieldRecord,
  UpdatableFieldKey,
  Supplement,
  SupplementsAction,
  LandAction,
} from '@/types/plant-farming'
import { useUserLocation } from '@/hooks/use-user-location'

const PlantFarmingView = () => {
  const { coordinates, error, permissionState, isLoading, requestLocation } =
    useUserLocation()
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

  const fieldLabels = useMemo(() => FIELD_LABELS, [])
  const supplementsCount = useMemo(() => supplements.length, [supplements])

  const [debouncedPatch] = useDebouncedCallback(
    (patch: Partial<LandDetails>) => {
      dispatchLand({ type: 'patch', payload: patch })
    },
    250
  )

  const handleLongitudeChange = useCallback(
    (value: string) => {
      debouncedPatch({ longitude: value })
    },
    [debouncedPatch]
  )

  const handleLatitudeChange = useCallback(
    (value: string) => {
      debouncedPatch({ latitude: value })
    },
    [debouncedPatch]
  )

  const handleSizeChange = useCallback(
    (value: string) => {
      debouncedPatch({ size: value })
    },
    [debouncedPatch]
  )

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

  const onChangeProjectName = useCallback((value: string) => {
    dispatchLand({ type: 'patch', payload: { projectName: value } })
  }, [])

  const onChangeLocation = useCallback((value: string) => {
    dispatchLand({ type: 'patch', payload: { location: value } })
  }, [])

  const onChangeSoilType = useCallback((value: string) => {
    dispatchLand({ type: 'patch', payload: { soilType: value } })
  }, [])

  const onChangeCropPlanted = useCallback((value: string) => {
    dispatchLand({ type: 'patch', payload: { cropPlanted: value } })
  }, [])

  const onChangePlantingDate = useCallback((value: string) => {
    dispatchLand({ type: 'patch', payload: { plantingDate: value } })
  }, [])

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
    console.log('Saving:', { landDetails, supplements, updatableFields })
  }, [landDetails, supplements, updatableFields])

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Plant Farming Management
          </h2>
          <p className="text-muted-foreground">
            Manage your crop projects and land details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Land Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Wheat Field A"
                  value={landDetails.projectName}
                  onChange={(e) => onChangeProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., North Field Section"
                  value={landDetails.location}
                  onChange={(e) => onChangeLocation(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="e.g., -74.0060"
                    value={landDetails.longitude}
                    onChange={(e) => handleLongitudeChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="e.g., 40.7128"
                    value={landDetails.latitude}
                    onChange={(e) => handleLatitudeChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Select onValueChange={onChangeSoilType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                    <SelectItem value="peaty">Peaty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cropPlanted">Crop Planted</Label>
                <Input
                  id="cropPlanted"
                  placeholder="e.g., Wheat, Corn, Rice"
                  value={landDetails.cropPlanted}
                  onChange={(e) => onChangeCropPlanted(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size (acres)</Label>
                  <Input
                    id="size"
                    placeholder="e.g., 25"
                    value={landDetails.size}
                    onChange={(e) => handleSizeChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plantingDate">Planting Date</Label>
                  <Input
                    id="plantingDate"
                    type="date"
                    value={landDetails.plantingDate}
                    onChange={(e) => onChangePlantingDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Supplements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supplementRows}
              <Button
                onClick={addSupplement}
                variant="outline"
                className="w-full bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Supplement
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wheat className="h-5 w-5" />
              Plant Event Records
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Field Type</Label>
                <Select
                  value={selectedField}
                  onValueChange={(value) =>
                    setSelectedField(value as UpdatableFieldKey)
                  }
                >
                  <SelectTrigger>
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
                <Label>Add New Record</Label>
                <Input
                  placeholder={`Enter ${fieldLabels[
                    selectedField
                  ].toLowerCase()} details`}
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                />
              </div>
              <Button onClick={addFieldValue} disabled={isPending}>
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Project</Button>
        </div>
      </main>
    </div>
  )
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

export default PlantFarmingView
