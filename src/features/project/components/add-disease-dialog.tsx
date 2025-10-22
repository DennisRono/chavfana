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
import { useAppDispatch } from "@/store/hooks"
import { createAnimalDisease } from "@/store/actions/animal-disease"
import { toast } from "sonner"
import { animalDiseaseSchema, type AnimalDiseaseForm } from "@/schemas/animal-health-records"

interface AddDiseaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  animalId: string
  onSuccess: () => void
}

export function AddDiseaseDialog({ open, onOpenChange, animalId, onSuccess }: AddDiseaseDialogProps) {
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnimalDiseaseForm>({
    resolver: zodResolver(animalDiseaseSchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      animal: animalId,
    },
  })

  const onSubmit = async (data: AnimalDiseaseForm) => {
    try {
      await dispatch(createAnimalDisease({ animalId, diseaseData: data })).unwrap()
      toast.success("Disease record added")
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to add disease record")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Disease Record</DialogTitle>
          <DialogDescription>Record a disease for this animal</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Disease Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <>
                  <Input id="name" placeholder="e.g., Foot and Mouth" {...field} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Disease"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
