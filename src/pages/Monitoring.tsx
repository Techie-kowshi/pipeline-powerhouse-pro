
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  RefreshCw,
  TrendingUp,
  Database,
  Zap
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const performanceData = [
  { time: "00:00", throughput: 1200, latency: 45, errors: 2 },
  { time: "04:00", throughput: 800, latency: 52, errors: 1 },
  { time: "08:00", throughput: 2100, latency: 38, errors: 0 },
  { time: "12:00", throughput: 2800, latency: 42, errors: 3 },
  { time: "16:00", throughput: 3200, latency: 35, errors: 1 },
  { time: "20:00", throughput: 2600, latency: 48, errors: 2 },
]

export default function Monitoring() {
  const [pipelines, setPipelines] = useState([
    {
      id: "p1",
      name: "Customer Data ETL",
      status: "running",
      lastRun: "2 minutes ago",
      nextRun: "In 58 minutes",
      throughput: "2.3K records/min",
      success: 98.5,
      errors: 12
    },
    {
      id: "p2", 
      name: "Analytics Pipeline",
      status: "idle",
      lastRun: "1 hour ago",
      nextRun: "In 2 hours",
      throughput: "1.1K records/min",
      success: 99.2,
      errors: 3
    },
    {
      id: "p3",
      name: "Financial Reports",
      status: "error",
      lastRun: "Failed 15 minutes ago",
      nextRun: "Scheduled for retry",
      throughput: "0 records/min",
      success: 85.3,
      errors: 45
    }
  ])

  const [alerts] = useState([
    {
      id: "a1",
      type: "error",
      pipeline: "Financial Reports",
      message: "Connection timeout to source database",
      time: "15 minutes ago"
    },
    {
      id: "a2",
      type: "warning", 
      pipeline: "Customer Data ETL",
      message: "High memory usage detected (85%)",
      time: "1 hour ago"
    },
    {
      id: "a3",
      type: "info",
      pipeline: "Analytics Pipeline",
      message: "Pipeline completed successfully", 
      time: "1 hour ago"
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Activity className="h-4 w-4 text-green-500 animate-pulse" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      running: "bg-green-500 text-white",
      error: "bg-red-500 text-white", 
      idle: "bg-yellow-500 text-white"
    }
    return variants[status as keyof typeof variants] || "bg-gray-500 text-white"
  }

  const handlePipelineAction = (pipelineId: string, action: string) => {
    setPipelines(prev => prev.map(p => {
      if (p.id === pipelineId) {
        if (action === "start") {
          return { ...p, status: "running", lastRun: "Just started" }
        } else if (action === "stop") {
          return { ...p, status: "idle", lastRun: "Just stopped" }
        } else if (action === "restart") {
          return { ...p, status: "running", lastRun: "Restarting..." }
        }
      }
      return p
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pipeline Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your data pipelines and system performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Pipelines</p>
                <p className="text-2xl font-bold text-green-600">
                  {pipelines.filter(p => p.status === 'running').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Throughput</p>
                <p className="text-2xl font-bold">3.4K</p>
                <p className="text-xs text-muted-foreground">records/min</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">98.2%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.type === 'error').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipelines" className="w-full">
        <TabsList>
          <TabsTrigger value="pipelines">Pipeline Status</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines" className="space-y-4">
          <div className="space-y-4">
            {pipelines.map((pipeline) => (
              <Card key={pipeline.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(pipeline.status)}
                      <div>
                        <CardTitle className="text-base">{pipeline.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Last run: {pipeline.lastRun} | Next: {pipeline.nextRun}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(pipeline.status)}>
                      {pipeline.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Throughput</p>
                      <p className="font-medium">{pipeline.throughput}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="font-medium text-green-600">{pipeline.success}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Errors (24h)</p>
                      <p className="font-medium text-red-600">{pipeline.errors}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {pipeline.status === "running" ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePipelineAction(pipeline.id, "stop")}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePipelineAction(pipeline.id, "start")}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePipelineAction(pipeline.id, "restart")}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Restart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Throughput Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="throughput" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="errors" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {alert.type === "error" && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                    {alert.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                    {alert.type === "info" && <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{alert.pipeline}</span>
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
