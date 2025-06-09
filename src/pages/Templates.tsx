import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { TemplateCard } from "@/components/templates/TemplateCard"
import { TemplatePreviewModal } from "@/components/modals/TemplatePreviewModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter } from "lucide-react"

const templates = [
  {
    id: "1",
    name: "E-commerce Analytics Pipeline",
    description: "Complete analytics pipeline for e-commerce platforms with real-time sales tracking and customer behavior analysis",
    category: "Analytics",
    estimatedTime: "30 minutes",
    rating: 4.8,
    uses: 1250,
    sources: ["Shopify API", "Google Analytics", "Customer Database"],
    destinations: ["Data Warehouse", "Analytics Dashboard", "Email Reports"]
  },
  {
    id: "2", 
    name: "Customer Data Sync",
    description: "Synchronize customer data across multiple platforms with data validation and duplicate detection",
    category: "Data Integration",
    estimatedTime: "15 minutes",
    rating: 4.6,
    uses: 890,
    sources: ["CRM System", "Marketing Platform"],
    destinations: ["Customer Database", "Analytics Platform"]
  },
  {
    id: "3",
    name: "Financial Reporting Pipeline",
    description: "Automated financial data processing with compliance checks and regulatory reporting features",
    category: "Finance",
    estimatedTime: "45 minutes", 
    rating: 4.9,
    uses: 567,
    sources: ["Accounting Software", "Bank APIs", "Transaction Logs"],
    destinations: ["Financial Database", "Compliance Reports", "Executive Dashboard"]
  },
  {
    id: "4",
    name: "Social Media Analytics",
    description: "Collect and analyze social media metrics across multiple platforms for brand monitoring",
    category: "Marketing",
    estimatedTime: "20 minutes",
    rating: 4.7,
    uses: 743,
    sources: ["Twitter API", "Facebook API", "Instagram API"],
    destinations: ["Analytics Database", "Marketing Dashboard"]
  },
  {
    id: "5",
    name: "IoT Data Processing",
    description: "Real-time processing of IoT sensor data with anomaly detection and alerting capabilities",
    category: "IoT",
    estimatedTime: "35 minutes",
    rating: 4.5,
    uses: 324,
    sources: ["IoT Sensors", "MQTT Broker", "Device Registry"],
    destinations: ["Time Series Database", "Alert System", "Monitoring Dashboard"]
  },
  {
    id: "6",
    name: "Log Analysis Pipeline",
    description: "Parse and analyze application logs for error detection and performance monitoring",
    category: "Monitoring",
    estimatedTime: "25 minutes",
    rating: 4.4,
    uses: 456,
    sources: ["Application Logs", "Server Logs", "Error Tracking"],
    destinations: ["Log Database", "Alert System", "Performance Dashboard"]
  }
]

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const navigate = useNavigate()

  const categories = [...new Set(templates.map(t => t.category))]
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: any) => {
    navigate('/builder', { state: { template } })
  }

  const handlePreviewTemplate = (template: any) => {
    setPreviewTemplate(template)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline Templates</h1>
          <p className="text-muted-foreground mt-2">
            Pre-built templates to get you started quickly
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
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
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={selectedCategory === "" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory("")}
        >
          All ({templates.length})
        </Badge>
        {categories.map(category => {
          const count = templates.filter(t => t.category === category).length
          return (
            <Badge 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({count})
            </Badge>
          )
        })}
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
          <p className="text-muted-foreground">No templates found matching your criteria</p>
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreviewModal 
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        onUse={handleUseTemplate}
      />
    </div>
  )
}
