
import { DataSourceCard } from "@/components/sources/DataSourceCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"

const dataSources = [
  {
    id: "1",
    name: "Customer Database",
    type: "Database",
    status: "connected" as const,
    description: "PostgreSQL database containing customer information",
    lastSync: "2 minutes ago",
    recordCount: "2.4M"
  },
  {
    id: "2",
    name: "Salesforce CRM",
    type: "Cloud",
    status: "connected" as const,
    description: "Sales data and customer interactions",
    lastSync: "1 hour ago",
    recordCount: "856K"
  },
  {
    id: "3",
    name: "Google Analytics",
    type: "API",
    status: "connected" as const,
    description: "Website analytics and user behavior data",
    lastSync: "30 minutes ago",
    recordCount: "12.8M"
  },
  {
    id: "4",
    name: "Stripe Payments",
    type: "API",
    status: "error" as const,
    description: "Payment transactions and billing data",
    lastSync: "Failed 2 hours ago",
    recordCount: "334K"
  },
  {
    id: "5",
    name: "Marketing Automation",
    type: "Cloud",
    status: "disconnected" as const,
    description: "Email campaigns and marketing metrics",
    lastSync: "6 hours ago",
    recordCount: "1.2M"
  },
  {
    id: "6",
    name: "Inventory System",
    type: "Database",
    status: "connected" as const,
    description: "Product catalog and inventory levels",
    lastSync: "15 minutes ago",
    recordCount: "45K"
  }
]

export default function DataSources() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
          <p className="text-muted-foreground mt-2">
            Manage your data connections and sources
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Data Source
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search data sources..." 
            className="pl-10"
          />
        </div>
        <Tabs defaultValue="all" className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="disconnected">Issues</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Data Sources Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((source) => (
              <DataSourceCard key={source.id} source={source} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="connected" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dataSources
              .filter(source => source.status === "connected")
              .map((source) => (
                <DataSourceCard key={source.id} source={source} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="disconnected" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dataSources
              .filter(source => source.status !== "connected")
              .map((source) => (
                <DataSourceCard key={source.id} source={source} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
