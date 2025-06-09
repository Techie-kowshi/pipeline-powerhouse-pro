
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    pipeline: "Customer Data ETL",
    action: "Pipeline completed successfully",
    timestamp: "2 minutes ago",
    status: "success",
    icon: CheckCircle
  },
  {
    id: 2,
    pipeline: "Product Analytics Pipeline",
    action: "Data transformation warning",
    timestamp: "15 minutes ago",
    status: "warning",
    icon: AlertCircle
  },
  {
    id: 3,
    pipeline: "Financial Reporting ETL",
    action: "Connection established to Oracle DB",
    timestamp: "32 minutes ago",
    status: "info",
    icon: Clock
  },
  {
    id: 4,
    pipeline: "Real-time Event Processing",
    action: "Pipeline failed - connection timeout",
    timestamp: "1 hour ago",
    status: "error",
    icon: XCircle
  },
  {
    id: 5,
    pipeline: "Marketing Data Sync",
    action: "Scheduled run completed",
    timestamp: "2 hours ago",
    status: "success",
    icon: CheckCircle
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "text-green-400"
    case "warning":
      return "text-yellow-400"
    case "error":
      return "text-red-400"
    default:
      return "text-blue-400"
  }
}

export function RecentActivity() {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <activity.icon className={`h-5 w-5 mt-0.5 ${getStatusColor(activity.status)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.pipeline}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.timestamp}
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${getStatusColor(activity.status)} bg-transparent`}
              >
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
