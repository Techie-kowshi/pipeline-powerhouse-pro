
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Server, Monitor, FileCode } from "lucide-react"

const stats = [
  {
    title: "Active Pipelines",
    value: "47",
    change: "+12%",
    icon: FileCode,
    color: "text-blue-400"
  },
  {
    title: "Data Sources",
    value: "23",
    change: "+3%",
    icon: Database,
    color: "text-green-400"
  },
  {
    title: "Monthly Processed",
    value: "1.2TB",
    change: "+25%",
    icon: Server,
    color: "text-purple-400"
  },
  {
    title: "Success Rate",
    value: "99.7%",
    change: "+0.2%",
    icon: Monitor,
    color: "text-yellow-400"
  }
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-green-400 mt-1">
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
