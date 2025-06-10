
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
import { useToast } from "@/hooks/use-toast"
import { DataSource } from "@/types/dataSource"

export default function DataSources() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "Production Database",
      type: "Database",
      status: "connected",
      description: "Main PostgreSQL database containing customer and order data",
      lastSync: "2 minutes ago",
      recordCount: "2.4M records",
      connectionString: "postgresql://user:pass@localhost:5432/production"
    },
    {
      id: "2",
      name: "Analytics API",
      type: "API",
      status: "connected",
      description: "Google Analytics data via REST API for website metrics",
      lastSync: "15 minutes ago",
      recordCount: "890K events",
      connectionString: "https://analyticsreporting.googleapis.com/v4/reports:batchGet"
    },
    {
      id: "3",
      name: "CRM System",
      type: "Cloud",
      status: "disconnected",
      description: "Salesforce CRM data including leads and opportunities",
      lastSync: "2 hours ago",
      recordCount: "156K contacts",
      connectionString: "https://yourinstance.salesforce.com/services/data/v54.0/"
    },
    {
      id: "4",
      name: "File Storage",
      type: "Cloud",
      status: "error",
      description: "AWS S3 bucket containing CSV exports and log files",
      lastSync: "1 day ago",
      recordCount: "45GB files",
      connectionString: "s3://your-bucket-name/data/"
    }
  ])

  const { toast } = useToast()

  const filteredSources = dataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || source.status === filter
    return matchesSearch && matchesFilter
  })

  const handleTestConnection = async (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId)
    if (!source) return

    // Update status to testing
    setDataSources(prev => prev.map(s => 
      s.id === sourceId ? { ...s, status: 'testing' } : s
    ))

    toast({
      title: "Testing Connection",
      description: `Testing connection to ${source.name}...`
    })

    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate
      setDataSources(prev => prev.map(s => 
        s.id === sourceId ? { 
          ...s, 
          status: success ? 'connected' : 'error',
          lastSync: success ? 'Just now' : s.lastSync
        } : s
      ))
      
      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success ? `${source.name} is connected` : `Failed to connect to ${source.name}`,
        variant: success ? "default" : "destructive"
      })
    }, 2000)
  }

  const handleSync = async (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId)
    if (!source) return

    toast({
      title: "Sync Started",
      description: `Syncing data from ${source.name}...`
    })

    // Simulate sync process
    setTimeout(() => {
      setDataSources(prev => prev.map(s => 
        s.id === sourceId ? { 
          ...s, 
          lastSync: 'Just now',
          recordCount: `${(Math.random() * 1000 + 1000).toFixed(0)}K records`
        } : s
      ))
      
      toast({
        title: "Sync Complete",
        description: `Successfully synced data from ${source.name}`
      })
    }, 3000)
  }

  const handleAddDataSource = () => {
    const newSource: DataSource = {
      id: `ds-${Date.now()}`,
      name: `New Data Source ${dataSources.length + 1}`,
      type: "Database",
      status: "disconnected",
      description: "Configure this data source",
      lastSync: "Never",
      recordCount: "0 records",
      connectionString: ""
    }
    
    setDataSources(prev => [...prev, newSource])
    toast({
      title: "Data Source Added",
      description: "New data source created. Configure it to get started."
    })
  }

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
          <Button onClick={handleAddDataSource}>
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
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search data sources..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="disconnected">Disconnected</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Summary */}
          <div className="flex gap-4">
            <Badge variant="outline" className="text-green-600">
              Connected: {dataSources.filter(s => s.status === 'connected').length}
            </Badge>
            <Badge variant="outline" className="text-yellow-600">
              Disconnected: {dataSources.filter(s => s.status === 'disconnected').length}
            </Badge>
            <Badge variant="outline" className="text-red-600">
              Error: {dataSources.filter(s => s.status === 'error').length}
            </Badge>
          </div>

          {/* Sources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSources.map((source) => (
              <DataSourceCard 
                key={source.id} 
                source={source}
                onTestConnection={handleTestConnection}
                onSync={handleSync}
              />
            ))}
          </div>

          {filteredSources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No data sources found matching your criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <ConnectionManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
