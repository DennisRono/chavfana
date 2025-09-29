'use client'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Beef,
  Users,
  MapPin,
  Activity,
  DollarSign,
  Heart,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import { AnimalRecordRow } from './components/animal-record-row'
import { GroupStatisticsForm } from './components/group-statistics-form'
import { toast } from 'sonner'
import type {
  AnimalData,
  IndividualRecord,
  GroupData,
  FarmingType,
} from '@/types/animal-farming'
import { useAppDispatch } from '@/store/hooks'
import { createProject } from '@/store/actions/create-project'
import type { AnimalKeepingProject } from '@/types/project'
import { useUserLocation } from '@/hooks/use-user-location'

const AnimalFarmingView = () => {
  const { coordinates, error, permissionState, isLoading, requestLocation } =
    useUserLocation()
  const [farmingType, setFarmingType] = useState<FarmingType>('individual')
  const [animalData, setAnimalData] = useState<AnimalData>({
    projectName: '',
    animalType: '',
    breed: '',
    location: '',
    startDate: '',
  })

  const [manualCoordinates, setManualCoordinates] = useState({
    latitude: '',
    longitude: '',
  })

  const [individualRecords, setIndividualRecords] = useState<
    IndividualRecord[]
  >([{ id: 1, tagId: '', age: '', weight: '', healthStatus: '' }])

  const [groupData, setGroupData] = useState<GroupData>({
    startNumber: '',
    currentNumber: '',
    averageAge: '',
    averageWeight: '',
  })

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (permissionState === 'granted' && coordinates) {
      setManualCoordinates({
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString(),
      })
    }
  }, [coordinates, permissionState])

  const handleLocationRequest = async () => {
    try {
      await requestLocation()
      if (coordinates) {
        toast.success('Location detected successfully!')
      }
    } catch (err) {
      toast.error('Failed to get location. Please enter coordinates manually.')
    }
  }

  const addIndividualRecord = useCallback(() => {
    setIndividualRecords((prev) => [
      ...prev,
      { id: Date.now(), tagId: '', age: '', weight: '', healthStatus: '' },
    ])
  }, [])

  const removeIndividualRecord = useCallback((id: number) => {
    setIndividualRecords((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const updateIndividualRecord = useCallback(
    (id: number, field: keyof IndividualRecord, value: string) => {
      setIndividualRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
      )
    },
    []
  )

  const handleCreateProject = useCallback(() => {
    const baseLocation = {
      country: '',
      city: '',
      coordinate: {
        latitude: Number(manualCoordinates.latitude) || 0,
        longitude: Number(manualCoordinates.longitude) || 0,
      },
    }

    const baseGroup = {
      group_name: animalData.projectName || 'Default Group',
      housing: 'BARN' as const,
      group_created_date: animalData.startDate || new Date().toISOString(),
    }

    const completeProjectData: AnimalKeepingProject = {
      name: animalData.projectName || 'Untitled Animal Project',
      created_date: new Date().toISOString(),
      type: 'AnimalKeepingProject',
      status: 'Active',
      location: baseLocation,
      animal_group:
        farmingType === 'individual'
          ? {
              ...baseGroup,
              type: 'Individual',
              animals: {
                tag: individualRecords[0]?.tagId || '',
                breed: animalData.breed || '',
                name: '',
                arrival_date: animalData.startDate || new Date().toISOString(),
                birthday: '',
                type: animalData.animalType || '',
                gender: 'MALE',
                weight: Number(individualRecords[0]?.weight) || 0,
                age: individualRecords[0]?.age || 0,
                notes: individualRecords[0]?.healthStatus || '',
              },
            }
          : {
              ...baseGroup,
              type: 'Group',
              animals: {
                breed: animalData.breed || '',
                name: '',
                arrival_date: animalData.startDate || new Date().toISOString(),
                birthday: '',
                type: animalData.animalType || '',
                gender: 'MALE',
                average_weight: Number(groupData.averageWeight) || 0,
                average_age: Number(groupData.averageAge) || 0,
                starting_number: Number(groupData.startNumber) || 0,
                notes: '',
              },
            },
    }

    dispatch(createProject(completeProjectData))
  }, [
    animalData,
    manualCoordinates,
    individualRecords,
    groupData,
    farmingType,
    dispatch,
  ])

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

        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-t-lg py-2">
            <CardTitle className="text-xl">Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Project Name
                </Label>
                <Input
                  value={animalData.projectName}
                  onChange={(e) =>
                    setAnimalData((prev) => ({
                      ...prev,
                      projectName: e.target.value,
                    }))
                  }
                  placeholder="Enter project name"
                  className="text-base"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Animal Type
                </Label>
                <Select
                  value={animalData.animalType}
                  onValueChange={(value) =>
                    setAnimalData((prev) => ({ ...prev, animalType: value }))
                  }
                >
                  <SelectTrigger className=" text-base">
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cattle">Cattle</SelectItem>
                    <SelectItem value="sheep">Sheep</SelectItem>
                    <SelectItem value="goats">Goats</SelectItem>
                    <SelectItem value="pigs">Pigs</SelectItem>
                    <SelectItem value="poultry">Poultry</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Breed
                </Label>
                <Input
                  value={animalData.breed}
                  onChange={(e) =>
                    setAnimalData((prev) => ({
                      ...prev,
                      breed: e.target.value,
                    }))
                  }
                  placeholder="Enter breed"
                  className=" text-base"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Start Date
                </Label>
                <Input
                  type="date"
                  value={animalData.startDate}
                  onChange={(e) =>
                    setAnimalData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-32 text-base"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Location Description
              </Label>
              <Textarea
                value={animalData.location}
                onChange={(e) =>
                  setAnimalData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="Describe the farm location"
                className="min-h-[80px] text-base"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <Label className="text-sm font-semibold text-gray-700">
                  GPS Coordinates
                </Label>
                {permissionState === 'granted' && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Auto-detected
                  </div>
                )}
              </div>

              {permissionState === 'granted' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Latitude</Label>
                    <div className=" px-3 py-2 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700 font-medium">
                      {manualCoordinates.latitude}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Longitude</Label>
                    <div className=" px-3 py-2 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700 font-medium">
                      {manualCoordinates.longitude}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Latitude</Label>
                      <Input
                        value={manualCoordinates.latitude}
                        onChange={(e) =>
                          setManualCoordinates((prev) => ({
                            ...prev,
                            latitude: e.target.value,
                          }))
                        }
                        placeholder="Enter latitude"
                        className=" text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Longitude</Label>
                      <Input
                        value={manualCoordinates.longitude}
                        onChange={(e) =>
                          setManualCoordinates((prev) => ({
                            ...prev,
                            longitude: e.target.value,
                          }))
                        }
                        placeholder="Enter longitude"
                        className=" text-base"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleLocationRequest}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Current Location
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs
          value={farmingType}
          onValueChange={(value) => setFarmingType(value as FarmingType)}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/80 backdrop-blur-sm border shadow-lg">
            <TabsTrigger
              value="individual"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-700 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <Beef className="h-4 w-4" />
              Individual Records
            </TabsTrigger>
            <TabsTrigger
              value="group"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-700 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4" />
              Group Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            <Card className="border-1 shadow-lg bg-white/80 backdrop-blur-sm pt-0">
              <CardHeader className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-t-lg py-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Beef className="h-5 w-5" />
                  Individual Animal Records
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {individualRecords.map((record) => (
                  <AnimalRecordRow
                    key={record.id}
                    record={record}
                    updateIndividualRecord={updateIndividualRecord}
                    removeIndividualRecord={removeIndividualRecord}
                    disableRemove={individualRecords.length === 1}
                  />
                ))}
                <Button
                  onClick={addIndividualRecord}
                  variant="outline"
                  className="w-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 text-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Animal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="group" className="space-y-6">
            <GroupStatisticsForm
              groupData={groupData}
              setGroupData={setGroupData}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end space-x-4">
          <Button
            variant="outline"
            className="px-8 py-3 text-base border-gray-300 hover:bg-gray-50 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            className="px-8 py-3 text-base bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-lg"
          >
            Save Project
          </Button>
        </div>
      </main>
    </div>
  )
}

export default AnimalFarmingView
