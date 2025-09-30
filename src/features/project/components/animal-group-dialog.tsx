'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import {
  createAnimalGroup,
  getAnimalGroupById,
} from '@/store/actions/animal-group'
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
    type: 'Group',
    housing: 'Indoor',
  })

  useEffect(() => {
    if (groupId && open) {
      const fetchGroup = async () => {
        try {
          const result = await dispatch(
            getAnimalGroupById({ projectId, groupId })
          ).unwrap()
          setFormData({
            group_name: result.group_name,
            type: result.type,
            housing: result.housing,
          })
        } catch (err) {
          toast.error('Error', {
            description: 'Failed to load animal group',
          })
        }
      }
      fetchGroup()
    } else {
      setFormData({ group_name: '', type: 'Group', housing: 'Indoor' })
    }
  }, [groupId, open, dispatch, projectId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (groupId) {
        // await dispatch(
        //   updateAnimalGroup({ projectId, groupId, groupData: formData })
        // ).unwrap()
        toast('Success', {
          description: 'Animal group updated successfully',
        })
      } else {
        await dispatch(
          createAnimalGroup({ projectId, groupData: formData })
        ).unwrap()
        toast('Success', {
          description: 'Animal group created successfully',
        })
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{groupId ? 'Edit' : 'Create'} Animal Group</DialogTitle>
          <DialogDescription>
            {groupId
              ? 'Update the animal group details'
              : 'Add a new animal group to your project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group_name">Group Name</Label>
            <Input
              id="group_name"
              value={formData.group_name}
              onChange={(e) =>
                setFormData({ ...formData, group_name: e.target.value })
              }
              placeholder="e.g., Broiler Batch 1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Group">Group</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
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
                <SelectItem value="Indoor">Indoor</SelectItem>
                <SelectItem value="Outdoor">Outdoor</SelectItem>
                <SelectItem value="Free Range">Free Range</SelectItem>
              </SelectContent>
            </Select>
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
