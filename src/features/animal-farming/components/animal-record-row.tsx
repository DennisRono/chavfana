'use client'

import React from 'react'
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
import { Trash2 } from 'lucide-react'
import type { IndividualRecord } from '@/types/animal-farming'
import { HEALTH_STATUSES } from '@/constants/animal-farming'

interface AnimalRecordRowProps {
  record: IndividualRecord
  updateIndividualRecord: (
    id: number,
    field: keyof IndividualRecord,
    value: string
  ) => void
  removeIndividualRecord: (id: number) => void
  disableRemove: boolean
}

export const AnimalRecordRow = React.memo<AnimalRecordRowProps>(
  ({
    record,
    updateIndividualRecord,
    removeIndividualRecord,
    disableRemove,
  }) => {
    return (
      <div className="grid grid-cols-5 gap-4 items-end p-4 border rounded-lg">
        <div className="space-y-2">
          <Label>Tag ID</Label>
          <Input
            placeholder="A001"
            value={record.tagId}
            onChange={(e) =>
              updateIndividualRecord(record.id, 'tagId', e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Age (months)</Label>
          <Input
            placeholder="24"
            value={record.age}
            onChange={(e) =>
              updateIndividualRecord(record.id, 'age', e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Weight (kg)</Label>
          <Input
            placeholder="450"
            value={record.weight}
            onChange={(e) =>
              updateIndividualRecord(record.id, 'weight', e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Health Status</Label>
          <Select
            onValueChange={(value) =>
              updateIndividualRecord(record.id, 'healthStatus', value)
            }
            value={record.healthStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {HEALTH_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => removeIndividualRecord(record.id)}
          disabled={disableRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }
)

AnimalRecordRow.displayName = 'AnimalRecordRow'
