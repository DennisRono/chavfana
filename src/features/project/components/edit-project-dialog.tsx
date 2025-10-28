"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { updateProject } from "@/store/actions/project"
import { toast } from "sonner"
import type { ProjectResponse } from "@/types/project"
import africanCountries from "@/data/countries.json"

const soilSchema = z
  .object({
    type: z.string().optional(),
    nitrogen: z
      .union([z.string(), z.number()])
      .transform((v) => (v === "" ? undefined : Number(v)))
      .optional(),
    phosphorous: z
      .union([z.string(), z.number()])
      .transform((v) => (v === "" ? undefined : Number(v)))
      .optional(),
    potassium: z
      .union([z.string(), z.number()])
      .transform((v) => (v === "" ? undefined : Number(v)))
      .optional(),
    soil_ph: z
      .union([z.string(), z.number()])
      .transform((v) => (v === "" ? undefined : Number(v)))
      .optional(),
  })
  .optional()

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  status: z.enum(["Planning", "Active", "Completed", "Archived"]),
  location: z.object({
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
  }),
  soil: soilSchema,
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse | null
  onSuccess: () => void
}

export function EditProjectDialog({ open, onOpenChange, project, onSuccess }: EditProjectDialogProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      status: "Planning",
      location: { country: "", city: "" },
      soil: project?.type === "PlantingProject" ? {} : undefined,
    },
  })

  useEffect(() => {
    if (open && project) {
      const location = project?.location
      const soil = project?.soil
      const status = project?.status

      form.reset({
        name: project?.name ?? "",
        status: (status as "Planning" | "Active" | "Completed" | "Archived") || "Planning",
        location: {
          city: location?.city ?? "",
          country: location?.country ?? "",
        },
        soil:
          project?.type === "PlantingProject"
            ? {
                type: soil?.type ?? "",
                nitrogen: soil?.nitrogen ?? undefined,
                phosphorous: soil?.phosphorous ?? undefined,
                potassium: soil?.potassium ?? undefined,
                soil_ph: soil?.soil_ph ?? undefined,
              }
            : undefined,
      })
    }
  }, [open, project, form])

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (!project?.id || typeof project.id !== "string") {
        toast.error("Error", { description: "Invalid project ID" })
        return
      }

      setLoading(true)

      const payload: Partial<ProjectFormValues> = {
        name: data.name,
        status: data.status,
        location: data.location,
        ...(project.type === "PlantingProject" && { soil: data.soil }),
      }

      await dispatch(updateProject({ projectId: project.id, data: payload })).unwrap()

      toast.success("Success", { description: "Project updated successfully" })
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      const errorMessage = err?.message || err?.detail || "Failed to update project"
      toast.error("Error", { description: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const selectedCountry = form.watch("location.country")
  const availableCities = africanCountries.find((c) => c?.code === selectedCountry)?.cities || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project details</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" {...form.register("name")} disabled={loading} required />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-x-4">
            <div className="space-y-2 flex-1">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as "Planning" | "Active" | "Completed" | "Archived")
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <Label>Country</Label>
              <Select
                value={form.watch("location.country")}
                onValueChange={(value) => form.setValue("location.country", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {africanCountries.map((country) => (
                    <SelectItem key={country?.code} value={country?.code || ""}>
                      {country?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.location?.country && (
                <p className="text-sm text-destructive">{form.formState.errors.location.country.message}</p>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <Label>City</Label>
              <Select
                value={form.watch("location.city")}
                onValueChange={(value) => form.setValue("location.city", value)}
                disabled={!availableCities.length || loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.location?.city && (
                <p className="text-sm text-destructive">{form.formState.errors.location.city.message}</p>
              )}
            </div>
          </div>

          {project?.type === "PlantingProject" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="soil_type">Soil Type</Label>
                <Input id="soil_type" {...form.register("soil.type")} disabled={loading} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nitrogen">Nitrogen</Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    step="0.01"
                    {...form.register("soil.nitrogen")}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phosphorous">Phosphorous</Label>
                  <Input
                    id="phosphorous"
                    type="number"
                    step="0.01"
                    {...form.register("soil.phosphorous")}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium</Label>
                  <Input
                    id="potassium"
                    type="number"
                    step="0.01"
                    {...form.register("soil.potassium")}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soil_ph">Soil pH</Label>
                  <Input id="soil_ph" type="number" step="0.1" {...form.register("soil.soil_ph")} disabled={loading} />
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
