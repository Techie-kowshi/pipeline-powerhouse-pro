
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Cloud, Globe, Server } from "lucide-react"

interface DataSourceCardProps {
  source: {
    id: string
    name: string
    type: string
    status: "connected" | "disconnected" | "error"
    description: string
    lastSync: string
    recordCount: string
  }
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
      return "status-success"
    case "error":
      return "status-error"
    default:
      return "status-warning"
  }
}

export function DataSourceCard({ source }: DataSourceCardProps) {
  const Icon = getSourceIcon(source.type)

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
          <Badge 
            variant="secondary" 
            className={`px-2 py-1 text-xs ${getStatusColor(source.status)}`}
          >
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
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            Configure
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
