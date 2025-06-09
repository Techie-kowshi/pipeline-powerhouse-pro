
import { TemplateCard } from "@/components/templates/TemplateCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"

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
        <Button>
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
          />
        </div>
        <Tabs defaultValue="all" className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Templates Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates
              .filter(template => template.category.toLowerCase() === "analytics")
              .map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
          </div>
        </TabsContent>
        {/* Add other category filters as needed */}
      </Tabs>
    </div>
  )
}
