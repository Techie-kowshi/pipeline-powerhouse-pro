
import { useState } from "react"
import { TemplateCard } from "@/components/templates/TemplateCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

const templates = [
  {
    id: "1",
    name: "Customer 360 Analytics",
    description: "Complete customer data pipeline combining CRM, support tickets, and website analytics",
    category: "Analytics",
    estimatedTime: "30 minutes",
    rating: 4.8,
    uses: 1247,
    sources: ["Salesforce", "Zendesk", "Google Analytics"],
    destinations: ["Snowflake", "PowerBI"]
  },
  {
    id: "2",
    name: "E-commerce Data Warehouse",
    description: "ETL pipeline for online retail data including orders, inventory, and customer behavior",
    category: "E-commerce",
    estimatedTime: "45 minutes",
    rating: 4.6,
    uses: 892,
    sources: ["Shopify", "Stripe", "Facebook Ads"],
    destinations: ["BigQuery", "Tableau"]
  },
  {
    id: "3",
    name: "Financial Reporting Pipeline",
    description: "Automated financial data aggregation and reporting for compliance and analysis",
    category: "Finance",
    estimatedTime: "60 minutes",
    rating: 4.9,
    uses: 634,
    sources: ["QuickBooks", "Stripe", "Bank APIs"],
    destinations: ["Oracle DB", "Excel"]
  },
  {
    id: "4",
    name: "Marketing Attribution Model",
    description: "Multi-touch attribution pipeline tracking customer journey across all channels",
    category: "Marketing",
    estimatedTime: "40 minutes",
    rating: 4.7,
    uses: 567,
    sources: ["Google Ads", "Facebook Ads", "Email Platform"],
    destinations: ["Data Warehouse", "Analytics"]
  },
  {
    id: "5",
    name: "IoT Sensor Data Processing",
    description: "Real-time processing of IoT sensor data with anomaly detection and alerting",
    category: "IoT",
    estimatedTime: "50 minutes",
    rating: 4.5,
    uses: 423,
    sources: ["MQTT", "InfluxDB", "Kafka"],
    destinations: ["TimescaleDB", "Grafana"]
  },
  {
    id: "6",
    name: "HR Analytics Dashboard",
    description: "Employee data pipeline for HR metrics, performance tracking, and workforce analytics",
    category: "HR",
    estimatedTime: "35 minutes",
    rating: 4.4,
    uses: 389,
    sources: ["BambooHR", "Slack", "Jira"],
    destinations: ["Data Warehouse", "Looker"]
  }
]

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const { toast } = useToast()
  const navigate = useNavigate()

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || 
                           template.category.toLowerCase() === activeCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: any) => {
    // Navigate to pipeline builder with template data
    navigate('/builder', { state: { template } })
    toast({
      title: "Template Applied",
      description: `${template.name} has been loaded in the pipeline builder`,
    })
  }

  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template)
    setPreviewOpen(true)
  }

  const createTemplate = () => {
    toast({
      title: "Create Template",
      description: "Template creation wizard opened",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline Templates</h1>
          <p className="text-muted-foreground mt-2">
            Pre-built templates to accelerate your data pipeline development
          </p>
        </div>
        <Button onClick={createTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="e-commerce">E-commerce</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="iot">IoT</TabsTrigger>
            <TabsTrigger value="hr">HR</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <TemplateCard 
            key={template.id} 
            template={template}
            onUse={handleUseTemplate}
            onPreview={handlePreviewTemplate}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Template Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Template Preview: {selectedTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedTemplate.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Est. {selectedTemplate.estimatedTime} • Used {selectedTemplate.uses.toLocaleString()} times
                </span>
              </div>
              
              <p className="text-muted-foreground">{selectedTemplate.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Data Sources</h4>
                  <div className="space-y-1">
                    {selectedTemplate.sources.map((source: string) => (
                      <div key={source} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        {source}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">Destinations</h4>
                  <div className="space-y-1">
                    {selectedTemplate.destinations.map((dest: string) => (
                      <div key={dest} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        {dest}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleUseTemplate(selectedTemplate)} className="flex-1">
                  Use This Template
                </Button>
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
