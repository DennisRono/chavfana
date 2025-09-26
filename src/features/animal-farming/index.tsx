'use client'
import React, { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Beef, Users, Trash2, Calendar } from 'lucide-react'

const AnimalFarmingView = () => {
  const [farmingType, setFarmingType] = useState<'individual' | 'group'>(
    'individual'
  )
  const [animalData, setAnimalData] = useState({
    projectName: '',
    animalType: '',
    breed: '',
    location: '',
    startDate: '',
  })

  const [individualRecords, setIndividualRecords] = useState([
    { id: 1, tagId: '', age: '', weight: '', healthStatus: '' },
  ])

  const [groupData, setGroupData] = useState({
    startNumber: '',
    currentNumber: '',
    averageAge: '',
    averageWeight: '',
  })

  const [processes, setProcesses] = useState<any>([])
  const [sales, setSales] = useState<any>([])
  const [treatments, setTreatments] = useState<any>([])

  const [newRecord, setNewRecord] = useState({
    type: 'process',
    description: '',
    date: '',
    quantity: '',
    cost: '',
  })

  const addIndividualRecord = () => {
    setIndividualRecords([
      ...individualRecords,
      {
        id: Date.now(),
        tagId: '',
        age: '',
        weight: '',
        healthStatus: '',
      },
    ])
  }

  const removeIndividualRecord = (id: number) => {
    setIndividualRecords(individualRecords.filter((r) => r.id !== id))
  }

  const updateIndividualRecord = (id: number, field: string, value: string) => {
    setIndividualRecords(
      individualRecords.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const addRecord = () => {
    const record = {
      ...newRecord,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }

    switch (newRecord.type) {
      case 'process':
        setProcesses([...processes, record])
        break
      case 'sale':
        setSales([...sales, record])
        break
      case 'treatment':
        setTreatments([...treatments, record])
        break
    }

    setNewRecord({
      type: 'process',
      description: '',
      date: '',
      quantity: '',
      cost: '',
    })
  }

  const removeRecord = (type: string, id: number) => {
    switch (type) {
      case 'process':
        setProcesses(processes.filter((p: any) => p.id !== id))
        break
      case 'sale':
        setSales(sales.filter((s: any) => s.id !== id))
        break
      case 'treatment':
        setTreatments(treatments.filter((t: any) => t.id !== id))
        break
    }
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

        {/* Project Basic Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="e.g., Dairy Cattle Group A"
                value={animalData.projectName}
                onChange={(e) =>
                  setAnimalData((prev) => ({
                    ...prev,
                    projectName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="animalType">Animal Type</Label>
              <Select
                onValueChange={(value) =>
                  setAnimalData((prev) => ({ ...prev, animalType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select animal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cattle">Cattle</SelectItem>
                  <SelectItem value="sheep">Sheep</SelectItem>
                  <SelectItem value="goat">Goat</SelectItem>
                  <SelectItem value="pig">Pig</SelectItem>
                  <SelectItem value="chicken">Chicken</SelectItem>
                  <SelectItem value="duck">Duck</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                placeholder="e.g., Holstein, Angus"
                value={animalData.breed}
                onChange={(e) =>
                  setAnimalData((prev) => ({ ...prev, breed: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Barn 1, Pasture A"
                value={animalData.location}
                onChange={(e) =>
                  setAnimalData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={animalData.startDate}
                onChange={(e) =>
                  setAnimalData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Animal Records Tabs */}
        <Tabs
          value={farmingType}
          onValueChange={(value) =>
            setFarmingType(value as 'individual' | 'group')
          }
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
                {individualRecords.map((record, index) => (
                  <div
                    key={record.id}
                    className="grid grid-cols-5 gap-4 items-end p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <Label>Tag ID</Label>
                      <Input
                        placeholder="A001"
                        value={record.tagId}
                        onChange={(e) =>
                          updateIndividualRecord(
                            record.id,
                            'tagId',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Age (months)</Label>
                      <Input
                        placeholder="24"
                        value={record.age}
                        onChange={(e) =>
                          updateIndividualRecord(
                            record.id,
                            'age',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input
                        placeholder="450"
                        value={record.weight}
                        onChange={(e) =>
                          updateIndividualRecord(
                            record.id,
                            'weight',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Health Status</Label>
                      <Select
                        onValueChange={(value) =>
                          updateIndividualRecord(
                            record.id,
                            'healthStatus',
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthy">Healthy</SelectItem>
                          <SelectItem value="sick">Sick</SelectItem>
                          <SelectItem value="recovering">Recovering</SelectItem>
                          <SelectItem value="pregnant">Pregnant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeIndividualRecord(record.id)}
                      disabled={individualRecords.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addIndividualRecord}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Animal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="group" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startNumber">Starting Number</Label>
                  <Input
                    id="startNumber"
                    placeholder="100"
                    value={groupData.startNumber}
                    onChange={(e) =>
                      setGroupData((prev) => ({
                        ...prev,
                        startNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentNumber">Current Number</Label>
                  <Input
                    id="currentNumber"
                    placeholder="95"
                    value={groupData.currentNumber}
                    onChange={(e) =>
                      setGroupData((prev) => ({
                        ...prev,
                        currentNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="averageAge">Average Age (months)</Label>
                  <Input
                    id="averageAge"
                    placeholder="12"
                    value={groupData.averageAge}
                    onChange={(e) =>
                      setGroupData((prev) => ({
                        ...prev,
                        averageAge: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="averageWeight">Average Weight (kg)</Label>
                  <Input
                    id="averageWeight"
                    placeholder="2.5"
                    value={groupData.averageWeight}
                    onChange={(e) =>
                      setGroupData((prev) => ({
                        ...prev,
                        averageWeight: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Activity Records */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Activity Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Record Form */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newRecord.type}
                  onValueChange={(value) =>
                    setNewRecord((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="process">Process</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Activity description"
                  value={newRecord.description}
                  onChange={(e) =>
                    setNewRecord((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) =>
                    setNewRecord((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  placeholder="10"
                  value={newRecord.quantity}
                  onChange={(e) =>
                    setNewRecord((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Cost ($)</Label>
                <Input
                  placeholder="500"
                  value={newRecord.cost}
                  onChange={(e) =>
                    setNewRecord((prev) => ({ ...prev, cost: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addRecord} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Display Records */}
            {[
              { title: 'Processes', data: processes, type: 'process' },
              { title: 'Sales', data: sales, type: 'sale' },
              { title: 'Treatments', data: treatments, type: 'treatment' },
            ].map(
              (section) =>
                section.data.length > 0 && (
                  <div key={section.type} className="space-y-2">
                    <h4 className="font-medium">{section.title}</h4>
                    <div className="space-y-2">
                      {section.data.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{item.date}</span>
                              </div>
                              <span>Qty: {item.quantity}</span>
                              <span>Cost: ${item.cost}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecord(section.type, item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Project</Button>
        </div>
      </main>
    </div>
  )
}

export default AnimalFarmingView
