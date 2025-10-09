'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import type { Supplement } from '@/types/plant-farming'

interface SupplementRowProps {
  supplement: Supplement
  onUpdate: (id: number, field: keyof Supplement, value: string) => void
  onRemove: (id: number) => void
  disabledRemove: boolean
}

export const SupplementRow = React.memo<SupplementRowProps>(
  function SupplementRow({ supplement, onUpdate, onRemove, disabledRemove }) {
    return (
      <div className="grid grid-cols-4 gap-2 items-end">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            placeholder="Fertilizer name"
            value={supplement.name}
            onChange={(e) => onUpdate(supplement.id, 'name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input
            placeholder="50 kg"
            value={supplement.quantity}
            onChange={(e) =>
              onUpdate(supplement.id, 'quantity', e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Price ($)</Label>
          <Input
            placeholder="100"
            value={supplement.price}
            onChange={(e) => onUpdate(supplement.id, 'price', e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRemove(supplement.id)}
          disabled={disabledRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }
)
