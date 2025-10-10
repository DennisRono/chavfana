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

interface IndividualAnimalRowProps {
  form: any
  formType: 'Individual' | 'Group'
}

export function IndividualAnimalRow({
  form,
  formType,
}: IndividualAnimalRowProps) {
  const animalType = form.watch('animal_group.type')
  if (animalType !== 'Individual') return null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tag ID</Label>
          <Input
            placeholder="A001"
            {...form.register('animal_group.animals.tag')}
          />
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.animals?.tag && (
              <p className="text-sm text-red-500">
                {form.formState.errors.animal_group.animals.tag.message}
              </p>
            )}
        </div>
        <div className="space-y-2">
          <Label>Breed</Label>
          <Input
            placeholder="Holstein"
            {...form.register('animal_group.animals.breed')}
          />
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.animals?.breed && (
              <p className="text-sm text-red-500">
                {form.formState.errors.animal_group.animals.breed.message}
              </p>
            )}
        </div>
        <div className="space-y-2">
          <Label>Group Name</Label>
          <Input
            placeholder="Bessie"
            {...form.register('animal_group.group_name')}
          />
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.group_name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.animal_group.animals.group_name}
              </p>
            )}
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            placeholder="Bessie"
            {...form.register('animal_group.animals.name')}
          />
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.animals?.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.animal_group.animals.name.message}
              </p>
            )}
        </div>
        <div className="space-y-2">
          <Label>Animal Type</Label>
          <Input
            placeholder="Cattle"
            {...form.register('animal_group.animals.type')}
          />
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.animals?.type && (
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
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.animals?.gender && (
              <p className="text-sm text-red-500">
                {form.formState.errors.animal_group.animals.gender.message}
              </p>
            )}
        </div>
        <div className="space-y-2">
          <Label>Age</Label>
          <Input
            placeholder="24 months"
            {...form.register('animal_group.animals.age')}
          />
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.animals?.age && (
              <p className="text-sm text-red-500">
                {form.formState.errors.animal_group.animals.age.message}
              </p>
            )}
        </div>
        <div className="space-y-2">
          <Label>Weight (kg)</Label>
          <Input
            type="number"
            placeholder="450"
            {...form.register('animal_group.animals.weight', {
              valueAsNumber: true,
            })}
          />
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.animals?.weight && (
              <p className="text-sm text-red-500">
                {form.formState.errors.animal_group.animals.weight.message}
              </p>
            )}
        </div>
        <div className="space-y-2">
          <Label>Arrival Date</Label>
          <Input
            type="date"
            {...form.register('animal_group.animals.arrival_date')}
          />
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.animals?.arrival_date && (
              <p className="text-sm text-red-500">
                {
                  form.formState.errors.animal_group.animals.arrival_date
                    .message
                }
              </p>
            )}
        </div>
        <div className="space-y-2">
          <Label>Birthday</Label>
          <Input
            type="date"
            {...form.register('animal_group.animals.birthday')}
          />
          {formType === 'Individual' &&
            form.formState.errors.animal_group?.animals?.birthday && (
              <p className="text-sm text-red-500">
                {form.formState.errors.animal_group.animals.birthday.message}
              </p>
            )}
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
