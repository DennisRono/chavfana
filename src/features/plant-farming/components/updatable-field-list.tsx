'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import type { FieldRecord, UpdatableFieldKey } from '@/types/plant-farming'

interface UpdatableFieldListProps {
  updatableFields: Record<UpdatableFieldKey, FieldRecord[]>
  onRemove: (field: UpdatableFieldKey, index: number) => void
  fieldLabels: Record<UpdatableFieldKey, string>
}

export const UpdatableFieldList = React.memo<UpdatableFieldListProps>(
  function UpdatableFieldList({ updatableFields, onRemove, fieldLabels }) {
    return (
      <>
        {(
          Object.entries(updatableFields) as [
            UpdatableFieldKey,
            FieldRecord[]
          ][]
        ).map(([field, values]) =>
          values.length > 0 ? (
            <div key={field} className="space-y-2">
              <h4 className="font-medium">{fieldLabels[field]}</h4>
              <div className="space-y-2">
                {values.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.value}</p>
                      <p className="text-sm text-muted-foreground">
                        Added: {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(field, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </>
    )
  }
)
