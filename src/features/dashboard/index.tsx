'use client'
import React, { useState } from 'react'
import {
  Wheat,
  Beef,
  Droplets,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
} from 'lucide-react'
import MetricCard from '@/components/shared/metric-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProjectsList from '@/components/shared/project-list'
import { useRouter } from 'next/navigation'

const DashboardView = () => {
  const { projects, loading, error } = {
    projects: {
      count: 0,
      next: 0,
      previous: 0,
      results: [],
      active_projects: 0,
      total_animals: 200,
      total_land_under_cultivation: 20,
    },
    loading: false,
    error: {},
  }
  const [searchQuery, setSearchQuery] = useState('')

  const [metrics, setMetrics] = useState({
    totalCrops: 0,
    livestock: 0,
    waterUsage: 0,
    revenue: 0,
  })
  const router = useRouter()
  return (
    <main className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {'Farm Manager'}!
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening on your farm today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Projects"
          value={projects.total_land_under_cultivation}
          change="+20.1% from last month"
          changeType="positive"
          icon={Wheat}
          subtitle="Plant & Animal Projects"
          variant="gradient"
        />
        <MetricCard
          title="Livestock"
          value={projects.total_animals}
          change="Total animals"
          changeType="negative"
          icon={Beef}
          subtitle="All livestock groups"
          variant="gradient"
        />
        <MetricCard
          title="Water Usage"
          value={metrics.waterUsage}
          change="Current period"
          changeType="neutral"
          icon={Droplets}
          subtitle="Resource monitoring"
          variant="gradient"
        />
        <MetricCard
          title="Revenue"
          value={metrics.revenue}
          change="Total earnings"
          changeType="neutral"
          icon={DollarSign}
          subtitle="Farm income"
          variant="gradient"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/plant-farming')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Wheat className="h-6 w-6 text-green-600" />
              Plant Farming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage crops, land details, supplements, and harvest records
            </p>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Manage Plant Projects
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/animal-farming')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Beef className="h-6 w-6 text-blue-600" />
              Animal Farming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Track individual and group animal records, health, and production
            </p>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Manage Animal Projects
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <ProjectsList
          searchQuery={searchQuery}
          apiProjects={projects}
          isLoading={loading}
          error={error}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900">Weather Alert</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Check weather conditions for optimal farming operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* <WeatherWidget />
          <QuickActions /> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Farm Status</p>
              <p className="text-2xl font-bold">Active</p>
              <p className="text-sm text-green-100">All systems operational</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Efficiency</p>
              <p className="text-2xl font-bold">--</p>
              <p className="text-sm text-blue-100">Resource utilization</p>
            </div>
            <Droplets className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Projects</p>
              <p className="text-2xl font-bold">{metrics.totalCrops}</p>
              <p className="text-sm text-purple-100">Total active</p>
            </div>
            <Wheat className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardView
