import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { AnimalResponse } from '@/types/animal-farming'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface AnimalCardProps {
  animal: AnimalResponse
  onUpdate?: (animalId: string, data: AnimalFormData) => Promise<void>
}

// Validation schema
const animalFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  breed: z.string().min(1, 'Breed is required'),
  type: z.string().min(1, 'Type is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  age: z.coerce.number().min(0, 'Age must be positive'),
  weight: z.coerce.number().min(0, 'Weight must be positive'),
  tag: z.string().min(1, 'Tag is required'),
  birthday: z.string().optional(),
  arrival_date: z.string().optional(),
  notes: z.string().optional(),
})

type AnimalFormData = z.infer<typeof animalFormSchema>

function EditAnimal({
  animal,
  onUpdate,
  trigger,
}: {
  animal: AnimalResponse
  onUpdate?: (animalId: string, data: AnimalFormData) => Promise<void>
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AnimalFormData>({
    resolver: zodResolver(animalFormSchema as any),
    defaultValues: {
      name: animal.name || '',
      breed: animal.breed || '',
      type: animal.type || '',
      gender: animal.gender || 'MALE',
      age: animal.age || 0,
      weight: animal.weight || 0,
      tag: animal.tag || '',
      birthday: animal.birthday || '',
      arrival_date: animal.arrival_date || '',
      notes: animal.notes || '',
    },
  })

  const handleSubmit = async (data: AnimalFormData) => {
    if (!onUpdate) {
      console.warn('No onUpdate function provided')
      setOpen(false)
      return
    }

    setIsLoading(true)
    try {
      await onUpdate(animal.id, data)
      setOpen(false)
      form.reset(data)
    } catch (error) {
      console.error('Failed to update animal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      form.reset({
        name: animal.name || '',
        breed: animal.breed || '',
        type: animal.type || '',
        gender: animal.gender || 'MALE',
        age: animal.age || 0,
        weight: animal.weight || 0,
        tag: animal.tag || '',
        birthday: animal.birthday || '',
        arrival_date: animal.arrival_date || '',
        notes: animal.notes || '',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit Animal Information</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Animal name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag *</FormLabel>
                    <FormControl>
                      <Input placeholder="Animal tag" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <FormControl>
                      <Input placeholder="Animal type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed *</FormLabel>
                    <FormControl>
                      <Input placeholder="Animal breed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (months) *</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg) *</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthday</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="arrival_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about the animal"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Animal'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function AnimalCard({ animal, onUpdate }: AnimalCardProps) {
  const {
    name,
    breed,
    gender,
    age,
    weight,
    health_status,
    birthday,
    arrival_date,
    notes,
    tag,
    type,
  } = animal

  // Safe health status extraction with multiple fallbacks
  const latestHealth =
    health_status?.length > 0
      ? health_status[health_status.length - 1]?.status
      : 'UNKNOWN'

  // Safe health variant function with proper type checking
  const getHealthVariant = (status: string | undefined) => {
    if (!status || typeof status !== 'string') {
      return 'outline'
    }

    const normalizedStatus = status.toLowerCase().trim()
    switch (normalizedStatus) {
      case 'healthy':
        return 'default'
      case 'sick':
        return 'destructive'
      case 'treated':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  // Safe date formatting with fallbacks
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'Unknown'

    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString()
    } catch {
      return 'Invalid Date'
    }
  }

  // Safe value display with fallbacks
  const displayValue = (value: any, fallback: string = 'Unknown'): string => {
    if (value === undefined || value === null) return fallback
    if (typeof value === 'string' && value.trim() === '') return fallback
    return String(value)
  }

  return (
    <Card className="w-full p-3 shadow-sm">
      <div className="flex justify-between">
        <div className="">
          <h1 className="font-bold text-xl">Animal Information</h1>
        </div>
        <EditAnimal
          animal={animal}
          onUpdate={onUpdate}
          trigger={
            <Button className="!h-8 !py-0">
              <Pencil />
              Edit
            </Button>
          }
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <CardTitle className="text-base font-semibold truncate">
              {displayValue(name, 'Unnamed Animal')}
            </CardTitle>
            <Badge variant={getHealthVariant(latestHealth)} className="text-xs">
              {displayValue(latestHealth)}
            </Badge>
          </div>

          <CardDescription className="text-sm mb-2">
            {displayValue(type)} • {displayValue(breed)} •{' '}
            {displayValue(gender)} • {displayValue(age)} months
          </CardDescription>

          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">{displayValue(weight)} kg</span>
            <span className="text-muted-foreground">#{displayValue(tag)}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Birthday</span>
              <p className="font-medium">{formatDate(birthday)}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Arrival</span>
              <p className="font-medium">{formatDate(arrival_date)}</p>
            </div>
            {notes && (
              <div className="col-span-2">
                <span className="text-muted-foreground text-xs">Notes</span>
                <p className="font-medium truncate" title={notes}>
                  {displayValue(notes)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
