'use client'
import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Beef, Users } from 'lucide-react'
import { ProjectInfoForm } from './components/project-info-form'
import { AnimalRecordRow } from './components/animal-record-row'
import { GroupStatisticsForm } from './components/group-statistics-form'
import type {
  AnimalData,
  IndividualRecord,
  GroupData,
  ActivityRecord,
  FarmingType,
} from '@/types/animal-farming'
import { useAppDispatch } from '@/store/hooks'
import { createProject } from '@/store/actions/create-project'
import { ProjectData } from '@/types/project'
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

  const [individualRecords, setIndividualRecords] = useState<
    IndividualRecord[]
  >([{ id: 1, tagId: '', age: '', weight: '', healthStatus: '' }])

  const [groupData, setGroupData] = useState<GroupData>({
    startNumber: '',
    currentNumber: '',
    averageAge: '',
    averageWeight: '',
  })

  const [processes, setProcesses] = useState<ActivityRecord[]>([])
  const [sales, setSales] = useState<ActivityRecord[]>([])
  const [treatments, setTreatments] = useState<ActivityRecord[]>([])

  const dispatch = useAppDispatch()

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

  const handleCreateProject = async () => {
    dispatch(createProject({} as ProjectData))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Animal Farming Management
          </h2>
          <p className="text-muted-foreground">
            Manage your livestock and animal records
          </p>
        </div>

        <ProjectInfoForm
          animalData={animalData}
          setAnimalData={setAnimalData}
        />

        <Tabs
          value={farmingType}
          onValueChange={(value) => setFarmingType(value as FarmingType)}
        >
          <TabsList className="grid !w-[500px] grid-cols-2 justify-start border-b rounded-none !bg-transparent">
            <TabsTrigger
              value="individual"
              className="flex items-center gap-2 rounded-none bg-transparent h-full data-[state=active]:shadow-none border border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-background -mb-[2px] rounded-t"
            >
              <Beef className="h-4 w-4" />
              Individual Records
            </TabsTrigger>
            <TabsTrigger
              value="group"
              className="flex items-center gap-2 rounded-none bg-transparent h-full data-[state=active]:shadow-none border border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-background -mb-[2px] rounded-t"
            >
              <Users className="h-4 w-4" />
              Group Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Individual Animal Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  className="w-full bg-transparent"
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
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => handleCreateProject()}>Save Project</Button>
        </div>
      </main>
    </div>
  )
}

export default AnimalFarmingView
