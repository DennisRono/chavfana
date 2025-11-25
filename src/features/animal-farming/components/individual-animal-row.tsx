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
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface IndividualAnimalRowProps {
  form: any
  formType: 'Individual' | 'Group'
}

export function IndividualAnimalRow({
  form,
  formType,
}: IndividualAnimalRowProps) {
  const animalType = form.watch('animal_group.type')
  const animals = form.watch('animal_group.animals') || []

  if (animalType !== 'Individual') return null

  const addAnimal = () => {
    const currentAnimals = form.getValues('animal_group.animals') || []
    form.setValue('animal_group.animals', [
      ...currentAnimals,
      {
        tag: '',
        breed: '',
        name: '',
        arrival_date: new Date().toISOString().split('T')[0],
        birthday: '',
        type: '',
        gender: 'MALE',
        weight: 0,
        age: 0,
        notes: '',
      },
    ])
  }

  const removeAnimal = (index: number) => {
    const currentAnimals = form.getValues('animal_group.animals') || []
    if (currentAnimals.length > 1) {
      const newAnimals = currentAnimals.filter(
        (_: any, i: number) => i !== index
      )
      form.setValue('animal_group.animals', newAnimals)
    }
  }

  const updateAnimalField = (index: number, field: string, value: any) => {
    const currentAnimals = form.getValues('animal_group.animals') || []
    const updatedAnimals = [...currentAnimals]
    updatedAnimals[index] = {
      ...updatedAnimals[index],
      [field]: value,
    }
    form.setValue('animal_group.animals', updatedAnimals)
  }

  return (
    <div className="space-y-6">
      {animals.map((animal: any, index: number) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg">Animal {index + 1}</h4>
            {animals.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeAnimal(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tag ID <span className='text-red-600'>*</span></Label>
              <Input
                placeholder="A001"
                value={animal.tag}
                onChange={(e) =>
                  updateAnimalField(index, 'tag', e.target.value)
                }
              />
              {form.formState.errors.animal_group?.animals?.[index]?.tag && (
                <p className="text-sm text-red-500">
                  {
                    form.formState.errors.animal_group.animals[index].tag
                      .message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Breed <span className='text-red-600'>*</span></Label>
              <Input
                placeholder="Holstein"
                value={animal.breed}
                onChange={(e) =>
                  updateAnimalField(index, 'breed', e.target.value)
                }
              />
              {form.formState.errors.animal_group?.animals?.[index]?.breed && (
                <p className="text-sm text-red-500">
                  {
                    form.formState.errors.animal_group.animals[index].breed
                      .message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Name <span className='text-red-600'>*</span></Label>
              <Input
                placeholder="Bessie"
                value={animal.name}
                onChange={(e) =>
                  updateAnimalField(index, 'name', e.target.value)
                }
              />
              {form.formState.errors.animal_group?.animals?.[index]?.name && (
                <p className="text-sm text-red-500">
                  {
                    form.formState.errors.animal_group.animals[index].name
                      .message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Animal Type <span className='text-red-600'>*</span></Label>
              <Select
                value={animal.type || 'Group'}
                onValueChange={(value) =>
                  updateAnimalField(index, 'type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select animal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Group">Group</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.animal_group?.animals?.[index]?.type && (
                <p className="text-sm text-red-500">
                  {
                    form.formState.errors.animal_group.animals[index].type
                      .message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Gender <span className='text-red-600'>*</span></Label>
              <Select
                value={animal.gender}
                onValueChange={(value) =>
                  updateAnimalField(index, 'gender', value)
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
              {form.formState.errors.animal_group?.animals?.[index]?.gender && (
                <p className="text-sm text-red-500">
                  {
                    form.formState.errors.animal_group.animals[index].gender
                      .message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Age (months) <span className='text-red-600'>*</span></Label>
              <Input
                placeholder="24"
                type="number"
                value={animal.age}
                onChange={(e) =>
                  updateAnimalField(index, 'age', Number(e.target.value))
                }
              />
              {form.formState.errors.animal_group?.animals?.[index]?.age && (
                <p className="text-sm text-red-500">
                  {
                    form.formState.errors.animal_group.animals[index].age
                      .message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Weight (kg) <span className='text-red-600'>*</span></Label>
              <Input
                type="number"
                placeholder="450"
                value={animal.weight}
                onChange={(e) =>
                  updateAnimalField(index, 'weight', Number(e.target.value))
                }
              />
              {form.formState.errors.animal_group?.animals?.[index]?.weight && (
                <p className="text-sm text-red-500">
                  {
                    form.formState.errors.animal_group.animals[index].weight
                      .message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Arrival Date</Label>
              <Input
                type="date"
                value={animal.arrival_date}
                onChange={(e) =>
                  updateAnimalField(index, 'arrival_date', e.target.value)
                }
              />
              {form.formState.errors.animal_group?.animals?.[index]
                ?.arrival_date && (
                <p className="text-sm text-red-500">
                  {
                    form.formState.errors.animal_group.animals[index]
                      .arrival_date.message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Birthday</Label>
              <Input
                type="date"
                value={animal.birthday}
                onChange={(e) =>
                  updateAnimalField(index, 'birthday', e.target.value)
                }
              />
              {form.formState.errors.animal_group?.animals?.[index]
                ?.birthday && (
                <p className="text-sm text-red-500">
                  {
                    form.formState.errors.animal_group.animals[index].birthday
                      .message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Notes (Optional)</Label>
              <Input
                placeholder="Additional notes"
                value={animal.notes}
                onChange={(e) =>
                  updateAnimalField(index, 'notes', e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addAnimal}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Animal
      </Button>
    </div>
  )
}
