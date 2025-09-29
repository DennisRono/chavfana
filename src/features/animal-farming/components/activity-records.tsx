'use client'

import type React from 'react'

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
import { Plus, Calendar, Trash2 } from 'lucide-react'
import type {
  ActivityRecord,
  ActivitySection,
  NewRecord,
} from '@/types/animal-farming'
import { ACTIVITY_TYPES } from '@/constants/animal-farming'

interface ActivityRecordsProps {
  activitySections: ActivitySection[]
  newRecord: NewRecord
  setNewRecord: React.Dispatch<React.SetStateAction<NewRecord>>
  addRecord: () => void
  removeRecord: (type: string, id: number) => void
}

export function ActivityRecords({
  activitySections,
  newRecord,
  setNewRecord,
  addRecord,
  removeRecord,
}: ActivityRecordsProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Activity Records</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={newRecord.type}
              onValueChange={(value: 'process' | 'sale' | 'treatment') =>
                setNewRecord((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
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
                setNewRecord((prev) => ({ ...prev, quantity: e.target.value }))
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

        {activitySections.map(
          (section) =>
            section.data.length > 0 && (
              <div key={section.type} className="space-y-2">
                <h4 className="font-medium">{section.title}</h4>
                <div className="space-y-2">
                  {section.data.map((item: ActivityRecord) => (
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
  )
}
