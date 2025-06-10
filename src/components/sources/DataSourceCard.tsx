
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Database, Cloud, Globe, Server, Settings, TestTube, RefreshCw, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface DataSourceCardProps {
  source: {
    id: string
    name: string
    type: string
    status: "connected" | "disconnected" | "error" | "testing"
    description: string
    lastSync: string
    recordCount: string
    connectionString?: string
  }
  onTestConnection?: (id: string) => void
  onSync?: (id: string) => void
}

const getSourceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "database":
      return Database
    case "cloud":
      return Cloud
    case "api":
      return Globe
    default:
      return Server
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return "bg-green-500 text-white"
    case "error":
      return "bg-red-500 text-white"
    case "testing":
      return "bg-blue-500 text-white animate-pulse"
    default:
      return "bg-yellow-500 text-white"
  }
}

export function DataSourceCard({ source, onTestConnection, onSync }: DataSourceCardProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [config, setConfig] = useState({
    name: source.name,
    description: source.description,
    connectionString: source.connectionString || ""
  })

  const Icon = getSourceIcon(source.type)

  const handleSaveConfig = () => {
    // In a real app, this would update the source configuration
    console.log("Saving config:", config)
    setIsConfigOpen(false)
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base text-foreground">{source.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{source.type}</p>
            </div>
          </div>
          <Badge className={`px-2 py-1 text-xs ${getStatusColor(source.status)}`}>
            {source.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {source.description}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Last Sync</p>
            <p className="text-foreground font-medium">{source.lastSync}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Records</p>
            <p className="text-foreground font-medium">{source.recordCount}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <Settings className="h-3 w-3 mr-1" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure {source.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="source-name">Name</Label>
                  <Input
                    id="source-name"
                    value={config.name}
                    onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="source-desc">Description</Label>
                  <Input
                    id="source-desc"
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="source-conn">Connection String</Label>
                  <Input
                    id="source-conn"
                    value={config.connectionString}
                    onChange={(e) => setConfig(prev => ({ ...prev, connectionString: e.target.value }))}
                    placeholder="Enter connection details..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveConfig} className="flex-1">
                    Save Configuration
                  </Button>
                  <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onTestConnection?.(source.id)}
            disabled={source.status === 'testing'}
          >
            <TestTube className="h-3 w-3 mr-1" />
            {source.status === 'testing' ? 'Testing...' : 'Test'}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="flex-1"
            onClick={() => onSync?.(source.id)}
            disabled={source.status !== 'connected'}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Sync Now
          </Button>
          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
