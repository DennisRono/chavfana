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

  const pack = form.watch('animal_group.pack') || {}

  const updatePackField = (field: string, value: any) => {
    const currentPack = form.getValues('animal_group.pack') || {}
    form.setValue('animal_group.pack', {
      ...currentPack,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Breed <span className='text-red-600'>*</span></Label>
          <Input
            placeholder="Holstein"
            value={pack.breed}
            onChange={(e) => updatePackField('breed', e.target.value)}
          />
          {form.formState.errors.animal_group?.pack?.breed && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.pack.breed.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Group Name <span className='text-red-600'>*</span></Label>
          <Input
            placeholder="Dairy Herd A"
            value={pack.name}
            onChange={(e) => updatePackField('name', e.target.value)}
          />
          {form.formState.errors.animal_group?.pack?.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.pack.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="animal-type">Animal Type <span className='text-red-600'>*</span></Label>
          <Select
            value={pack.type || 'Group'}
            onValueChange={(value) => updatePackField('type', value)}
            defaultValue="Group"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Group">Group</SelectItem>
              <SelectItem value="Individual">Individual</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.animal_group?.pack?.type && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.pack.type.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Gender <span className='text-red-600'>*</span></Label>
          <Select
            value={pack.gender}
            onValueChange={(value) => updatePackField('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="BOTH">Both</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.animal_group?.pack?.gender && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.pack.gender.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Starting Number <span className='text-red-600'>*</span></Label>
          <Input
            type="number"
            placeholder="100"
            value={pack.starting_number}
            onChange={(e) =>
              updatePackField('starting_number', Number(e.target.value))
            }
          />
          {form.formState.errors.animal_group?.pack?.starting_number && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.pack.starting_number.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Average Age (months)</Label>
          <Input
            type="number"
            placeholder="12"
            value={pack.average_age}
            onChange={(e) =>
              updatePackField('average_age', Number(e.target.value))
            }
          />
          {form.formState.errors.animal_group?.pack?.average_age && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.pack.average_age.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Average Weight (kg)</Label>
          <Input
            type="number"
            placeholder="450"
            value={pack.average_weight}
            onChange={(e) =>
              updatePackField('average_weight', Number(e.target.value))
            }
          />
          {form.formState.errors.animal_group?.pack?.average_weight && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.pack.average_weight.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Arrival Date</Label>
          <Input
            type="date"
            value={pack.arrival_date}
            onChange={(e) => updatePackField('arrival_date', e.target.value)}
          />
          {form.formState.errors.animal_group?.pack?.arrival_date && (
            <p className="text-sm text-red-500">
              {form.formState.errors.animal_group.pack.arrival_date.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Birthday (Optional)</Label>
          <Input
            type="date"
            value={pack.birthday}
            onChange={(e) => updatePackField('birthday', e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Notes (Optional)</Label>
          <Input
            placeholder="Additional notes about the group"
            value={pack.notes}
            onChange={(e) => updatePackField('notes', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
