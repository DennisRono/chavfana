import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: number | string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: LucideIcon
  subtitle?: string
  showTrendIcon?: boolean
  variant?: "default" | "gradient" | "bordered"
  formatValue?: (value: number | string) => string
}

const MetricCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  subtitle,
  showTrendIcon = true,
  variant = "default",
  formatValue,
}: MetricCardProps) => {
  const trendConfig = {
    positive: {
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      icon: TrendingUp,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    },
    negative: {
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      icon: TrendingDown,
      iconBg: "bg-red-100 dark:bg-red-900/50",
    },
    neutral: {
      color: "text-muted-foreground",
      bg: "bg-muted/30",
      border: "border-border",
      icon: Minus,
      iconBg: "bg-muted",
    },
  }[changeType]

  const TrendIcon = trendConfig.icon
  const displayValue = formatValue ? formatValue(value) : value

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5",
        variant === "gradient" &&
          changeType === "positive" &&
          "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background",
        variant === "gradient" &&
          changeType === "negative" &&
          "bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background",
        variant === "bordered" && `border-l-4 ${trendConfig.border}`,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", trendConfig.iconBg)}>
          <Icon className={cn("h-4 w-4", trendConfig.color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground tracking-tight">{displayValue}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>}
        <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", trendConfig.color)}>
          {showTrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricCard
