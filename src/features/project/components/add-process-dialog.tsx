"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch } from "@/store/hooks"
import { createAnimalProcess } from "@/store/actions/animal-process"
import { toast } from "sonner"
import { animalProcessSchema, type AnimalProcessForm } from "@/schemas/animal-health-records"

interface AddProcessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  animalId: string
  onSuccess: () => void
}

export function AddProcessDialog({ open, onOpenChange, animalId, onSuccess }: AddProcessDialogProps) {
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnimalProcessForm>({
    resolver: zodResolver(animalProcessSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "DEATH",
      number_of_animal: 1,
      animal: animalId,
    },
  })

  const onSubmit = async (data: AnimalProcessForm) => {
    try {
      await dispatch(createAnimalProcess({ animalId, processData: data })).unwrap()
      toast.success("Process record added")
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to add process record")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Process Record</DialogTitle>
          <DialogDescription>Record a process event for this animal</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Process Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEATH">Death</SelectItem>
                      <SelectItem value="SALE">Sale</SelectItem>
                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <>
                  <Input id="date" type="date" {...field} />
                  {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number_of_animal">Number of Animals</Label>
            <Controller
              name="number_of_animal"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    id="number_of_animal"
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                  />
                  {errors.number_of_animal && (
                    <p className="text-sm text-destructive">{errors.number_of_animal.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Process"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
