import type { UpdatableFieldKey } from "@/types/farming"

export const FIELD_LABELS: Record<UpdatableFieldKey, string> = {
  fertilitySpread: "Fertility Spread",
  pest: "Pest Control",
  diseases: "Disease Management",
  management: "Management Activities",
  species: "Species Information",
  harvest: "Harvest Records",
} as const
