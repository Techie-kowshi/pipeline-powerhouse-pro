
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Activity } from "lucide-react"

interface MetricData {
  timestamp: string
  value: number
}

interface PipelineMetrics {
  id: string
  name: string
  status: 'running' | 'success' | 'error' | 'warning'
  lastRun: string
  duration: string
  recordsProcessed: number
  errorCount: number
  throughput: MetricData[]
  errorRate: MetricData[]
}

export default function Monitoring() {
  const [metrics, setMetrics] = useState<PipelineMetrics[]>([
    {
      id: '1',
      name: 'Customer Data ETL',
      status: 'running',
      lastRun: '2 minutes ago',
      duration: '00:45:32',
      recordsProcessed: 125680,
      errorCount: 3,
      throughput: [],
      errorRate: []
    },
    {
      id: '2',
      name: 'Product Analytics Pipeline',
      status: 'success',
      lastRun: '15 minutes ago',
      duration: '00:12:45',
      recordsProcessed: 89432,
      errorCount: 0,
      throughput: [],
      errorRate: []
    },
    {
      id: '3',
      name: 'Financial Reporting ETL',
      status: 'error',
      lastRun: '1 hour ago',
      duration: '00:08:12',
      recordsProcessed: 0,
      errorCount: 15,
      throughput: [],
      errorRate: []
    }
  ])
  
  const [systemHealth, setSystemHealth] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    activeConnections: 0
  })
  
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 50) + 10
      }))

      setMetrics(prev => prev.map(metric => ({
        ...metric,
        recordsProcessed: metric.status === 'running' 
          ? metric.recordsProcessed + Math.floor(Math.random() * 100)
          : metric.recordsProcessed
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const refreshMetrics = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4 text-blue-400 animate-pulse" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline Monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring and performance metrics
          </p>
        </div>
        <Button onClick={refreshMetrics} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipelines">Pipeline Details</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Status Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Pipelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {metrics.filter(m => m.status === 'running').length}
                </div>
                <p className="text-xs text-green-400 mt-1">
                  +2 from last hour
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Records/Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.floor(metrics.reduce((acc, m) => acc + m.recordsProcessed, 0) / 24).toLocaleString()}
                </div>
                <p className="text-xs text-green-400 mt-1">
                  +15% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {((metrics.filter(m => m.status === 'success').length / metrics.length) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-green-400 mt-1">
                  +0.5% improvement
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {metrics.reduce((acc, m) => acc + m.errorCount, 0)}
                </div>
                <p className="text-xs text-red-400 mt-1">
                  +3 from last hour
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline Status Overview */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Pipeline Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.map((pipeline) => (
                  <div key={pipeline.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(pipeline.status)}
                      <div>
                        <h4 className="font-medium text-foreground">{pipeline.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last run: {pipeline.lastRun} • Duration: {pipeline.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {pipeline.recordsProcessed.toLocaleString()} records
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pipeline.errorCount} errors
                        </p>
                      </div>
                      <Badge className={getStatusColor(pipeline.status)}>
                        {pipeline.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {systemHealth.cpu.toFixed(1)}%
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${systemHealth.cpu}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {systemHealth.memory.toFixed(1)}%
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${systemHealth.memory}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {systemHealth.disk.toFixed(1)}%
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${systemHealth.disk}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {systemHealth.activeConnections}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Database connections
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Recent Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex gap-4 p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground">2024-01-15 14:32:15</span>
                  <span className="text-green-400">[INFO]</span>
                  <span>Customer Data ETL pipeline started successfully</span>
                </div>
                <div className="flex gap-4 p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground">2024-01-15 14:31:45</span>
                  <span className="text-yellow-400">[WARN]</span>
                  <span>Slow query detected in MongoDB source (2.3s)</span>
                </div>
                <div className="flex gap-4 p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground">2024-01-15 14:30:12</span>
                  <span className="text-red-400">[ERROR]</span>
                  <span>Financial Reporting ETL failed: Connection timeout</span>
                </div>
                <div className="flex gap-4 p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground">2024-01-15 14:29:33</span>
                  <span className="text-green-400">[INFO]</span>
                  <span>Product Analytics Pipeline completed: 89,432 records processed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
