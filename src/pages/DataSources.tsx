import { useState } from "react"
import { ConnectionManager } from "@/components/connections/ConnectionManager"
import { DataSourceCard } from "@/components/sources/DataSourceCard"
import { ImportDataModal } from "@/components/modals/ImportDataModal"
import { EnhancedExportModal } from "@/components/modals/EnhancedExportModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Upload, Download } from "lucide-react"

const dataSources = [
  {
    id: "1",
    name: "Production Database",
    type: "Database",
    status: "connected" as const,
    description: "Main PostgreSQL database containing customer and order data",
    lastSync: "2 minutes ago",
    recordCount: "2.4M records"
  },
  {
    id: "2",
    name: "Analytics API",
    type: "API",
    status: "connected" as const,
    description: "Google Analytics data via REST API for website metrics",
    lastSync: "15 minutes ago",
    recordCount: "890K events"
  },
  {
    id: "3",
    name: "CRM System",
    type: "Cloud",
    status: "disconnected" as const,
    description: "Salesforce CRM data including leads and opportunities",
    lastSync: "2 hours ago",
    recordCount: "156K contacts"
  },
  {
    id: "4",
    name: "File Storage",
    type: "Cloud",
    status: "error" as const,
    description: "AWS S3 bucket containing CSV exports and log files",
    lastSync: "1 day ago",
    recordCount: "45GB files"
  }
]

export default function DataSources() {
  const [filter, setFilter] = useState("all")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
          <p className="text-muted-foreground mt-2">
            Connect and manage your data sources
          </p>
        </div>
        <div className="flex gap-2">
          <ImportDataModal
            trigger={
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            }
          />
          <EnhancedExportModal
            trigger={
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            }
          />
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sources" className="w-full">
        <TabsList>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search data sources..." 
                className="pl-10"
              />
            </div>
          </div>

          {/* Sources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((source) => (
              <DataSourceCard key={source.id} source={source} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <ConnectionManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
