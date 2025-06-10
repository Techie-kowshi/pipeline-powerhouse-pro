
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Users, Zap, TrendingUp, Database } from "lucide-react"

interface DataFlowItem {
  id: string
  source: string
  type: 'user_action' | 'system_event' | 'data_sync' | 'api_call'
  message: string
  timestamp: Date
  status: 'success' | 'processing' | 'error'
  volume: number
}

export function RealTimeDataFlow() {
  const [dataFlow, setDataFlow] = useState<DataFlowItem[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0)
  const [eventsPerSecond, setEventsPerSecond] = useState(0)

  // Simulate real-time data flow
  useEffect(() => {
    if (!isConnected) return

    const sources = [
      'AWS CloudWatch',
      'Google Analytics',
      'Stripe Webhooks',
      'Salesforce API',
      'MongoDB Atlas',
      'Redis Cache',
      'Kubernetes Logs',
      'User App Events'
    ]

    const eventTypes = [
      { type: 'user_action' as const, messages: ['User login', 'Page view', 'Purchase completed', 'Form submitted'] },
      { type: 'system_event' as const, messages: ['Database backup', 'Cache refresh', 'Log rotation', 'Health check'] },
      { type: 'data_sync' as const, messages: ['ETL job completed', 'Data warehouse sync', 'Analytics update', 'Report generation'] },
      { type: 'api_call' as const, messages: ['API request', 'Webhook received', 'Service call', 'Data query'] }
    ]

    const interval = setInterval(() => {
      const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const newEvent: DataFlowItem = {
        id: `event-${Date.now()}-${Math.random()}`,
        source: sources[Math.floor(Math.random() * sources.length)],
        type: randomEventType.type,
        message: randomEventType.messages[Math.floor(Math.random() * randomEventType.messages.length)],
        timestamp: new Date(),
        status: Math.random() > 0.9 ? 'error' : Math.random() > 0.3 ? 'success' : 'processing',
        volume: Math.floor(Math.random() * 1000) + 1
      }

      setDataFlow(prev => [newEvent, ...prev.slice(0, 49)]) // Keep last 50 events
      setEventsPerSecond(prev => Math.floor(Math.random() * 50) + 10)
      setTotalUsers(prev => prev + Math.floor(Math.random() * 5))
    }, 500 + Math.random() * 1500) // Random interval between 0.5-2 seconds

    return () => clearInterval(interval)
  }, [isConnected])

  const getIcon = (type: string) => {
    switch (type) {
      case 'user_action': return Users
      case 'system_event': return Activity
      case 'data_sync': return Database
      case 'api_call': return Zap
      default: return Activity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500'
      case 'processing': return 'bg-blue-500 animate-pulse'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Data Flow
          </CardTitle>
          <Button
            variant={isConnected ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsConnected(!isConnected)}
          >
            {isConnected ? 'Disconnect' : 'Connect Live'}
          </Button>
        </div>
        
        {isConnected && (
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Events/sec:</span>
              <Badge variant="secondary">{eventsPerSecond}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Active Users:</span>
              <Badge variant="secondary">{totalUsers.toLocaleString()}</Badge>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {!isConnected ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Connect Live" to start monitoring real-time data flow</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {dataFlow.map((event, index) => {
              const Icon = getIcon(event.type)
              return (
                <div 
                  key={event.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border animate-fade-in ${
                    index === 0 ? 'bg-primary/5 border-primary/20' : 'bg-background/50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`p-2 rounded-full ${getStatusColor(event.status)}`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{event.source}</span>
                      <Badge variant="outline" className="text-xs">
                        {event.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{event.message}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{event.volume.toLocaleString()} records</div>
                    <div>{event.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
