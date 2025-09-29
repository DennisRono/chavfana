'use client'
import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Beef, Users } from 'lucide-react'
import { ProjectInfoForm } from './components/project-info-form'
import { AnimalRecordRow } from './components/animal-record-row'
import { GroupStatisticsForm } from './components/group-statistics-form'
import { ActivityRecords } from './components/activity-records'
import type {
  AnimalData,
  IndividualRecord,
  GroupData,
  ActivityRecord,
  NewRecord,
  FarmingType,
} from '@/types/animal-farming'

const AnimalFarmingView = () => {
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

  const [newRecord, setNewRecord] = useState<NewRecord>({
    type: 'process',
    description: '',
    date: '',
    quantity: '',
    cost: '',
  })

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

  const addRecord = useCallback(() => {
    const record: ActivityRecord = {
      ...newRecord,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }

    if (newRecord.type === 'process') setProcesses((prev) => [...prev, record])
    if (newRecord.type === 'sale') setSales((prev) => [...prev, record])
    if (newRecord.type === 'treatment')
      setTreatments((prev) => [...prev, record])

    setNewRecord({
      type: 'process',
      description: '',
      date: '',
      quantity: '',
      cost: '',
    })
  }, [newRecord])

  const removeRecord = useCallback((type: string, id: number) => {
    if (type === 'process')
      setProcesses((prev) => prev.filter((p) => p.id !== id))
    if (type === 'sale') setSales((prev) => prev.filter((s) => s.id !== id))
    if (type === 'treatment')
      setTreatments((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const activitySections = useMemo(
    () => [
      { title: 'Processes', data: processes, type: 'process' as const },
      { title: 'Sales', data: sales, type: 'sale' as const },
      { title: 'Treatments', data: treatments, type: 'treatment' as const },
    ],
    [processes, sales, treatments]
  )

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <Beef className="h-4 w-4" />
              Individual Records
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
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

        <ActivityRecords
          activitySections={activitySections}
          newRecord={newRecord}
          setNewRecord={setNewRecord}
          addRecord={addRecord}
          removeRecord={removeRecord}
        />

        <div className="mt-8 flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Project</Button>
        </div>
      </main>
    </div>
  )
}

export default AnimalFarmingView
