'use client'

import type React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AnimalData } from '@/types/animal-farming'
import { ANIMAL_TYPES } from '@/constants/animal-farming'

interface ProjectInfoFormProps {
  animalData: AnimalData
  setAnimalData: React.Dispatch<React.SetStateAction<AnimalData>>
}

export function ProjectInfoForm({
  animalData,
  setAnimalData,
}: ProjectInfoFormProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Project Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            placeholder="e.g., Dairy Cattle Group A"
            value={animalData.projectName}
            onChange={(e) =>
              setAnimalData((prev) => ({
                ...prev,
                projectName: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="animalType">Animal Type</Label>
          <Select
            onValueChange={(value) =>
              setAnimalData((prev) => ({ ...prev, animalType: value }))
            }
            value={animalData.animalType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animal type" />
            </SelectTrigger>
            <SelectContent>
              {ANIMAL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            placeholder="e.g., Holstein, Angus"
            value={animalData.breed}
            onChange={(e) =>
              setAnimalData((prev) => ({ ...prev, breed: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Barn 1, Pasture A"
            value={animalData.location}
            onChange={(e) =>
              setAnimalData((prev) => ({ ...prev, location: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={animalData.startDate}
            onChange={(e) =>
              setAnimalData((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
