
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause, MoreHorizontal } from "lucide-react"

const pipelines = [
  {
    id: 1,
    name: "Customer Data ETL",
    status: "running",
    lastRun: "2 minutes ago",
    nextRun: "In 58 minutes",
    sources: ["PostgreSQL", "Salesforce"],
    destination: "Data Warehouse"
  },
  {
    id: 2,
    name: "Product Analytics Pipeline",
    status: "success",
    lastRun: "1 hour ago",
    nextRun: "In 23 hours",
    sources: ["MongoDB", "Google Analytics"],
    destination: "BigQuery"
  },
  {
    id: 3,
    name: "Financial Reporting ETL",
    status: "warning",
    lastRun: "3 hours ago",
    nextRun: "In 21 hours",
    sources: ["Oracle DB", "Stripe API"],
    destination: "Snowflake"
  },
  {
    id: 4,
    name: "Real-time Event Processing",
    status: "error",
    lastRun: "Failed 15 minutes ago",
    nextRun: "Retrying in 45 minutes",
    sources: ["Kafka", "Redis"],
    destination: "Elasticsearch"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "status-running"
    case "success":
      return "status-success"
    case "warning":
      return "status-warning"
    case "error":
      return "status-error"
    default:
      return "status-pending"
  }
}

export function PipelineStatus() {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Pipeline Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pipelines.map((pipeline) => (
            <div 
              key={pipeline.id} 
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-foreground">{pipeline.name}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`px-2 py-1 text-xs ${getStatusColor(pipeline.status)}`}
                  >
                    {pipeline.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p>Last run: {pipeline.lastRun}</p>
                    <p>Next run: {pipeline.nextRun}</p>
                  </div>
                  <div>
                    <p>Sources: {pipeline.sources.join(", ")}</p>
                    <p>Destination: {pipeline.destination}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  {pipeline.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
