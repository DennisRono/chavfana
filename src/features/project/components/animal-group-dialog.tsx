'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch } from '@/store/hooks'
import {
  createAnimalGroup,
  getAnimalGroupById,
} from '@/store/actions/animal-group'
import { toast } from 'sonner'

interface AnimalGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  groupId?: string
  onSuccess: () => void
}

export function AnimalGroupDialog({
  open,
  onOpenChange,
  projectId,
  groupId,
  onSuccess,
}: AnimalGroupDialogProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    group_name: '',
    type: 'Individual' as 'Individual' | 'Group',
    housing: 'BARN',
    animal_type: '',
    breed: '',
    name: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    tag: '',
    weight: '',
    age: '',
    arrival_date: '',
    birthday: '',
    notes: '',
    starting_number: '',
    average_weight: '',
    average_age: '',
  })

  useEffect(() => {
    if (groupId && open) {
      const fetchGroup = async () => {
        try {
          const group = await dispatch(
            getAnimalGroupById({ projectId, groupId })
          ).unwrap()
          const animal = group.animals
          setFormData({
            group_name: group.group_name,
            type: group.type,
            housing: group.housing,
            animal_type: animal.type || '',
            breed: animal.breed || '',
            name: animal.name || '',
            gender: animal.gender || 'MALE',
            tag: animal.tag || '',
            weight: animal.weight?.toString() || '',
            age: animal.age?.toString() || '',
            arrival_date: animal.arrival_date || '',
            birthday: animal.birthday || '',
            notes: animal.notes || '',
            starting_number: animal.starting_number?.toString() || '',
            average_weight: animal.average_weight?.toString() || '',
            average_age: animal.average_age?.toString() || '',
          })
        } catch (err: any) {
          toast.error('Error', { description: 'Failed to load group data' })
        }
      }
      fetchGroup()
    } else if (!open) {
      setFormData({
        group_name: '',
        type: 'Individual',
        housing: 'BARN',
        animal_type: '',
        breed: '',
        name: '',
        gender: 'MALE',
        tag: '',
        weight: '',
        age: '',
        arrival_date: '',
        birthday: '',
        notes: '',
        starting_number: '',
        average_weight: '',
        average_age: '',
      })
    }
  }, [groupId, open, dispatch, projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = {
        group_name: formData.group_name,
        type: formData.type,
        housing: formData.housing,
        animal: {
          type: formData.animal_type,
          notes: formData.notes,
        },
      }

      if (formData.type === 'Individual') {
        payload.animal = {
          ...payload.animal,
          breed: formData.breed,
          name: formData.name,
          gender: formData.gender,
          tag: formData.tag,
          weight: Number.parseFloat(formData.weight),
          age: Number.parseInt(formData.age),
          arrival_date: formData.arrival_date,
          birthday: formData.birthday,
        }
      } else {
        payload.animal = {
          ...payload.animal,
          starting_number: Number.parseInt(formData.starting_number),
          average_weight: Number.parseFloat(formData.average_weight),
          average_age: Number.parseInt(formData.average_age),
        }
      }

      if (groupId) {
        // await dispatch(updateAnimalGroup({ projectId, groupId, data: payload })).unwrap()
        toast('Success', { description: 'Animal group updated successfully' })
      } else {
        // await dispatch(createAnimalGroup({ projectId, data: payload })).unwrap()
        toast('Success', { description: 'Animal group created successfully' })
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error('Error', {
        description: err.message || 'Failed to save animal group',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {groupId ? 'Edit Animal Group' : 'Create Animal Group'}
          </DialogTitle>
          <DialogDescription>
            {groupId
              ? 'Update the animal group details'
              : 'Add a new animal group to your project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="group_name">Group Name</Label>
              <Input
                id="group_name"
                value={formData.group_name}
                onChange={(e) =>
                  setFormData({ ...formData, group_name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="housing">Housing</Label>
              <Select
                value={formData.housing}
                onValueChange={(value) =>
                  setFormData({ ...formData, housing: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BARN">Barn</SelectItem>
                  <SelectItem value="PASTURE">Pasture</SelectItem>
                  <SelectItem value="COOP">Coop</SelectItem>
                  <SelectItem value="PEN">Pen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="animal_type">Animal Type</Label>
              <Input
                id="animal_type"
                value={formData.animal_type}
                onChange={(e) =>
                  setFormData({ ...formData, animal_type: e.target.value })
                }
                placeholder="e.g., Cattle, Chicken"
                required
              />
            </div>
          </div>

          {formData.type === 'Individual' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) =>
                    setFormData({ ...formData, breed: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag">Tag</Label>
                <Input
                  id="tag"
                  value={formData.tag}
                  onChange={(e) =>
                    setFormData({ ...formData, tag: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age (days)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrival_date">Arrival Date</Label>
                <Input
                  id="arrival_date"
                  type="date"
                  value={formData.arrival_date}
                  onChange={(e) =>
                    setFormData({ ...formData, arrival_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) =>
                    setFormData({ ...formData, birthday: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="starting_number">Number of Animals</Label>
                <Input
                  id="starting_number"
                  type="number"
                  value={formData.starting_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      starting_number: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="average_weight">Avg Weight (kg)</Label>
                <Input
                  id="average_weight"
                  type="number"
                  step="0.01"
                  value={formData.average_weight}
                  onChange={(e) =>
                    setFormData({ ...formData, average_weight: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="average_age">Avg Age (days)</Label>
                <Input
                  id="average_age"
                  type="number"
                  value={formData.average_age}
                  onChange={(e) =>
                    setFormData({ ...formData, average_age: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : groupId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
