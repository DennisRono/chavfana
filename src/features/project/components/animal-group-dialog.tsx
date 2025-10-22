"use client"

import { useEffect, useMemo } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch } from "@/store/hooks"
import { createAnimalGroup, getAnimalGroupById, updateAnimalGroup } from "@/store/actions/animal-group"
import { toast } from "sonner"
import { animalGroupDialogSchema, type AnimalGroupDialogForm } from "@/schemas/animal-group-dialog"

interface AnimalGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  groupId?: string
  onSuccess: () => void
}

export function AnimalGroupDialog({ open, onOpenChange, projectId, groupId, onSuccess }: AnimalGroupDialogProps) {
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnimalGroupDialogForm>({
    resolver: zodResolver(animalGroupDialogSchema),
    defaultValues: {
      group_name: "",
      type: "Individual",
      housing: "BARN",
      animal: {
        type: "",
        breed: "",
        name: "",
        gender: "MALE",
        tag: "",
        weight: 0,
        age: 0,
        arrival_date: "",
        birthday: "",
        notes: "",
      },
    },
  })

  const groupType = watch("type")

  const animalFields = useMemo(() => {
    if (groupType === "Individual") {
      return ["tag", "weight", "age"] as const
    }
    return ["starting_number", "average_weight", "average_age"] as const
  }, [groupType])

  useEffect(() => {
    if (groupId && open) {
      const fetchGroup = async () => {
        try {
          const group = await dispatch(getAnimalGroupById({ projectId, groupId })).unwrap()

          const formData: AnimalGroupDialogForm = {
            group_name: group.group_name,
            type: group.type as "Individual" | "Group",
            housing: group.housing,
            animal: {
              type: group.animals.type || "",
              breed: group.animals.breed || "",
              name: group.animals.name || "",
              gender: group.animals.gender || "MALE",
              ...(group.type === "Individual"
                ? {
                    tag: group.animals.tag || "",
                    weight: group.animals.weight || 0,
                    age: group.animals.age || 0,
                  }
                : {
                    starting_number: group.animals.starting_number || 0,
                    average_weight: group.animals.average_weight || 0,
                    average_age: group.animals.average_age || 0,
                  }),
              arrival_date: group.animals.arrival_date || "",
              birthday: group.animals.birthday || "",
              notes: group.animals.notes || "",
            },
          }
          reset(formData as any)
        } catch (err: any) {
          toast.error("Error", { description: "Failed to load group data" })
        }
      }
      fetchGroup()
    } else if (!open) {
      reset()
    }
  }, [groupId, open, dispatch, projectId, reset])

  const onSubmit = async (data: AnimalGroupDialogForm) => {
    try {
      if (groupId) {
        await dispatch(updateAnimalGroup({ projectId, groupId, data })).unwrap()
        toast.success("Animal group updated successfully")
      } else {
        await dispatch(createAnimalGroup({ projectId, data })).unwrap()
        toast.success("Animal group created successfully")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to save animal group")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{groupId ? "Edit Animal Group" : "Create Animal Group"}</DialogTitle>
          <DialogDescription>
            {groupId ? "Update the animal group details" : "Add a new animal group to your project"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="group_name">Group Name</Label>
              <Controller
                name="group_name"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="group_name" {...field} />
                    {errors.group_name && <p className="text-sm text-destructive">{errors.group_name.message}</p>}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
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
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="housing">Housing</Label>
              <Controller
                name="housing"
                control={control}
                render={({ field }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BARN">Barn</SelectItem>
                        <SelectItem value="PASTURE">Pasture</SelectItem>
                        <SelectItem value="CAGE">Cage</SelectItem>
                        <SelectItem value="PEN">Pen</SelectItem>
                        <SelectItem value="COOP">Coop</SelectItem>
                        <SelectItem value="STABLE">Stable</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.housing && <p className="text-sm text-destructive">{errors.housing.message}</p>}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="animal_type">Animal Type</Label>
              <Controller
                name="animal.type"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="animal_type" placeholder="e.g., Cattle, Chicken" {...field} />
                    {errors.animal?.type && <p className="text-sm text-destructive">{errors.animal.type.message}</p>}
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Controller
                name="animal.breed"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="breed" {...field} />
                    {errors.animal?.breed && <p className="text-sm text-destructive">{errors.animal.breed.message}</p>}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Controller
                name="animal.name"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="name" {...field} />
                    {errors.animal?.name && <p className="text-sm text-destructive">{errors.animal.name.message}</p>}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="animal.gender"
                control={control}
                render={({ field }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.animal?.gender && (
                      <p className="text-sm text-destructive">{errors.animal.gender.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            {groupType === "Individual" && (
              <div className="space-y-2">
                <Label htmlFor="tag">Tag</Label>
                <Controller
                  name="animal.tag"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input id="tag" {...field} />
                      {errors.animal?.tag && <p className="text-sm text-destructive">{errors.animal.tag.message}</p>}
                    </>
                  )}
                />
              </div>
            )}
          </div>

          {groupType === "Individual" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Controller
                  name="animal.weight"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      />
                      {errors.animal?.weight && (
                        <p className="text-sm text-destructive">{errors.animal.weight.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age (days)</Label>
                <Controller
                  name="animal.age"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="age"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                      />
                      {errors.animal?.age && <p className="text-sm text-destructive">{errors.animal.age.message}</p>}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrival_date">Arrival Date</Label>
                <Controller
                  name="animal.arrival_date"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input id="arrival_date" type="date" {...field} />
                      {errors.animal?.arrival_date && (
                        <p className="text-sm text-destructive">{errors.animal.arrival_date.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Controller
                  name="animal.birthday"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input id="birthday" type="date" {...field} />
                      {errors.animal?.birthday && (
                        <p className="text-sm text-destructive">{errors.animal.birthday.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="starting_number">Number of Animals</Label>
                <Controller
                  name="animal.starting_number"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="starting_number"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                      />
                      {errors.animal?.starting_number && (
                        <p className="text-sm text-destructive">{errors.animal.starting_number.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="average_weight">Avg Weight (kg)</Label>
                <Controller
                  name="animal.average_weight"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="average_weight"
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      />
                      {errors.animal?.average_weight && (
                        <p className="text-sm text-destructive">{errors.animal.average_weight.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="average_age">Avg Age (days)</Label>
                <Controller
                  name="animal.average_age"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="average_age"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                      />
                      {errors.animal?.average_age && (
                        <p className="text-sm text-destructive">{errors.animal.average_age.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrival_date">Arrival Date</Label>
                <Controller
                  name="animal.arrival_date"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input id="arrival_date" type="date" {...field} />
                      {errors.animal?.arrival_date && (
                        <p className="text-sm text-destructive">{errors.animal.arrival_date.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Controller
                  name="animal.birthday"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input id="birthday" type="date" {...field} />
                      {errors.animal?.birthday && (
                        <p className="text-sm text-destructive">{errors.animal.birthday.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Controller
              name="animal.notes"
              control={control}
              render={({ field }) => (
                <>
                  <Textarea id="notes" rows={3} {...field} />
                  {errors.animal?.notes && <p className="text-sm text-destructive">{errors.animal.notes.message}</p>}
                </>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : groupId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
