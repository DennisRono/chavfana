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
import type { SpeciesForm } from '@/schemas/plant-farming'

interface SpeciesRowProps {
  index: number
  species: SpeciesForm
  onUpdate: (index: number, field: string, value: string) => void
  onRemove: (index: number) => void
  disabledRemove: boolean
  errors?: any
}

export const SpeciesRow = React.memo<SpeciesRowProps>(function SpeciesRow({
  index,
  species,
  onUpdate,
  onRemove,
  disabledRemove,
  errors,
}) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Species {index + 1}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          disabled={disabledRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Variety</Label>
          <Input
            placeholder="e.g., Siberian kale"
            value={species.species.variety}
            onChange={(e) => onUpdate(index, 'species.variety', e.target.value)}
          />
          {errors?.species?.variety && (
            <p className="text-sm text-red-500">
              {errors.species.variety.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            placeholder="e.g., kale"
            value={species.species.name}
            onChange={(e) => onUpdate(index, 'species.name', e.target.value)}
          />
          {errors?.species?.name && (
            <p className="text-sm text-red-500">
              {errors.species.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Input
            placeholder="e.g., vegetable"
            value={species.species.type}
            onChange={(e) => onUpdate(index, 'species.type', e.target.value)}
          />
          {errors?.species?.type && (
            <p className="text-sm text-red-500">
              {errors.species.type.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Bloom Season</Label>
          <Input
            placeholder="e.g., 1 week"
            value={species.species.bloom_szn}
            onChange={(e) =>
              onUpdate(index, 'species.bloom_szn', e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            placeholder="e.g., 5"
            value={species.amount}
            onChange={(e) => onUpdate(index, 'amount', e.target.value)}
          />
          {errors?.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Select
            value={species.unit}
            onValueChange={(value) => onUpdate(index, 'unit', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KILOGRAM">Kilogram</SelectItem>
              <SelectItem value="GRAM">Gram</SelectItem>
              <SelectItem value="UNIT">Unit</SelectItem>
              <SelectItem value="POUND">Pound</SelectItem>
            </SelectContent>
          </Select>
          {errors?.unit && (
            <p className="text-sm text-red-500">{errors.unit.message}</p>
          )}
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Notes (Optional)</Label>
          <Input
            placeholder="Additional notes..."
            value={species.species.notes || ''}
            onChange={(e) => onUpdate(index, 'species.notes', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
})
