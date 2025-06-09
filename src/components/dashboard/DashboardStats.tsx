
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, TrendingUp, AlertTriangle, Play, Pause, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PipelineStats {
  id: string
  name: string
  status: 'running' | 'stopped' | 'error' | 'success'
  lastRun: string
  recordsProcessed: number
  successRate: number
}

export function DashboardStats() {
  const [pipelines, setPipelines] = useState<PipelineStats[]>([
    {
      id: '1',
      name: 'Customer Data ETL',
      status: 'running',
      lastRun: '2 minutes ago',
      recordsProcessed: 15420,
      successRate: 98.5
    },
    {
      id: '2',
      name: 'Sales Analytics',
      status: 'success',
      lastRun: '1 hour ago',
      recordsProcessed: 8760,
      successRate: 100
    },
    {
      id: '3',
      name: 'Log Processing',
      status: 'error',
      lastRun: '3 hours ago',
      recordsProcessed: 0,
      successRate: 0
    }
  ])

  const [systemMetrics, setSystemMetrics] = useState({
    activeConnections: 12,
    totalRecordsToday: 45680,
    avgProcessingTime: 2.3,
    errorRate: 1.2
  })

  const { toast } = useToast()

  const togglePipeline = (id: string) => {
    setPipelines(prev => prev.map(pipeline => {
      if (pipeline.id === id) {
        const newStatus = pipeline.status === 'running' ? 'stopped' : 'running'
        toast({
          title: `Pipeline ${newStatus}`,
          description: `${pipeline.name} is now ${newStatus}`
        })
        return { ...pipeline, status: newStatus, lastRun: 'just now' }
      }
      return pipeline
    }))
  }

  const restartPipeline = (id: string) => {
    const pipeline = pipelines.find(p => p.id === id)
    if (pipeline) {
      setPipelines(prev => prev.map(p => 
        p.id === id ? { ...p, status: 'running', lastRun: 'just now' } : p
      ))
      toast({
        title: "Pipeline Restarted",
        description: `${pipeline.name} has been restarted`
      })
    }
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPipelines(prev => prev.map(pipeline => {
        if (pipeline.status === 'running') {
          return {
            ...pipeline,
            recordsProcessed: pipeline.recordsProcessed + Math.floor(Math.random() * 100),
            successRate: Math.max(95, Math.min(100, pipeline.successRate + (Math.random() - 0.5)))
          }
        }
        return pipeline
      }))

      setSystemMetrics(prev => ({
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 3 - 1),
        totalRecordsToday: prev.totalRecordsToday + Math.floor(Math.random() * 500),
        avgProcessingTime: Math.max(1, prev.avgProcessingTime + (Math.random() - 0.5) * 0.1),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.2))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'success': return 'bg-blue-500'
      case 'error': return 'bg-red-500'
      case 'stopped': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'running': return 'default'
      case 'success': return 'secondary'
      case 'error': return 'destructive'
      case 'stopped': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.activeConnections}</div>
            <p className="text-xs text-muted-foreground">Live connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalRecordsToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.avgProcessingTime.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">Per record</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Status */}
      <Card>
        <CardHeader>
          <CardTitle>Active Pipelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelines.map((pipeline) => (
              <div key={pipeline.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(pipeline.status)} ${
                    pipeline.status === 'running' ? 'animate-pulse' : ''
                  }`} />
                  <div>
                    <h4 className="font-medium">{pipeline.name}</h4>
                    <p className="text-sm text-muted-foreground">Last run: {pipeline.lastRun}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{pipeline.recordsProcessed.toLocaleString()} records</p>
                    <p className="text-sm text-muted-foreground">{pipeline.successRate}% success rate</p>
                  </div>
                  <Badge variant={getStatusVariant(pipeline.status)}>
                    {pipeline.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePipeline(pipeline.id)}
                    >
                      {pipeline.status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restartPipeline(pipeline.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
