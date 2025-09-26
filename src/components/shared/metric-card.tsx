import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  subtitle?: string
}

const MetricCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  subtitle,
}: MetricCardProps) => {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-muted-foreground',
  }[changeType]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        <p className={`text-xs ${changeColor} mt-1`}>{change}</p>
      </CardContent>
    </Card>
  )
}

export default MetricCard
