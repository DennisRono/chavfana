'use client'

import type React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GroupData } from '@/types/animal-farming'

interface GroupStatisticsFormProps {
  groupData: GroupData
  setGroupData: React.Dispatch<React.SetStateAction<GroupData>>
}

export function GroupStatisticsForm({
  groupData,
  setGroupData,
}: GroupStatisticsFormProps) {
  return (
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
              setGroupData((prev) => ({ ...prev, startNumber: e.target.value }))
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
              setGroupData((prev) => ({ ...prev, averageAge: e.target.value }))
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
  )
}
