'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface GroupAnimalFormProps {
  form: any
  formType: 'Individual' | 'Group'
}

export function GroupAnimalForm({ form, formType }: GroupAnimalFormProps) {
  const animalType = form.watch('animal_group.type')
  if (animalType !== 'Group') return null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Breed</Label>
          <Input
            placeholder="Holstein"
            {...form.register('animal_group.animals.breed')}
          />
          {formType==="Group" && form.formState.errors.animal_group?.animals?.breed && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.animals.breed.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            placeholder="Group A"
            {...form.register('animal_group.animals.name')}
          />
        </div>
        <div className="space-y-2">
          <Label>Animal Type</Label>
          <Input
            placeholder="Cattle"
            {...form.register('animal_group.animals.type')}
          />
          {formType==="Group" && form.formState.errors.animal_group?.animals?.type && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.animals.type.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={form.watch('animal_group.animals.gender')}
            onValueChange={(value) =>
              form.setValue(
                'animal_group.animals.gender',
                value as 'MALE' | 'FEMALE'
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
          {formType==="Group" && form.formState.errors.animal_group?.animals?.gender && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.animals.gender.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Starting Number</Label>
          <Input
            type="number"
            placeholder="100"
            {...form.register('animal_group.animals.starting_number', {
              valueAsNumber: true,
            })}
          />
          {formType==="Group" && form.formState.errors.animal_group?.animals?.starting_number && (
            <p className="text-sm text-red-500">
              {
                form.formState.errors.animal_group.animals.starting_number
                  .message
              }
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Average Age (months)</Label>
          <Input
            type="number"
            placeholder="12"
            {...form.register('animal_group.animals.average_age', {
              valueAsNumber: true,
            })}
          />
          {formType==="Group" && form.formState.errors.animal_group?.animals?.average_age && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.animals.average_age.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Average Weight (kg)</Label>
          <Input
            type="number"
            placeholder="450"
            {...form.register('animal_group.animals.average_weight', {
              valueAsNumber: true,
            })}
          />
          {formType==="Group" && form.formState.errors.animal_group?.animals?.average_weight && (
            <p className="text-sm text-red-500">
              {
                form.formState.errors.animal_group.animals.average_weight
                  .message
              }
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Arrival Date</Label>
          <Input
            type="date"
            {...form.register('animal_group.animals.arrival_date')}
          />
          {formType==="Group" && form.formState.errors.animal_group?.animals?.arrival_date && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.animals.arrival_date.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Birthday (Optional)</Label>
          <Input
            type="date"
            {...form.register('animal_group.animals.birthday')}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Notes (Optional)</Label>
          <Input
            placeholder="Additional notes"
            {...form.register('animal_group.animals.notes')}
          />
        </div>
      </div>
    </div>
  )
}
