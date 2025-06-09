
import { StatsCards } from "@/components/dashboard/StatsCards"
import { PipelineStatus } from "@/components/dashboard/PipelineStatus"
import { DataFlowChart } from "@/components/dashboard/DataFlowChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your data pipelines and ETL processes
        </p>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Charts */}
      <DataFlowChart />

      {/* Status and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PipelineStatus />
        <RecentActivity />
      </div>
    </div>
  )
}
