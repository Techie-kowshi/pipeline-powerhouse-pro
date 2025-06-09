
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { DraggablePipelineCanvas } from "@/components/builder/DraggablePipelineCanvas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Play, Settings, Database, FileCode, Server, Filter, BarChart } from "lucide-react"
import { PipelineConfigModal } from "@/components/modals/PipelineConfigModal"
import { useToast } from "@/hooks/use-toast"

interface PipelineNode {
  id: string
  type: 'source' | 'transform' | 'destination'
  name: string
  config: any
  position: { x: number; y: number }
  status: 'idle' | 'running' | 'success' | 'error'
}

const componentLibrary = [
  {
    category: "Data Sources",
    icon: Database,
    color: "text-blue-400",
    components: [
      { name: "MongoDB", description: "NoSQL database connector" },
      { name: "PostgreSQL", description: "Relational database" },
      { name: "REST API", description: "HTTP API endpoint" },
      { name: "CSV File", description: "Comma-separated values" },
      { name: "Kafka", description: "Stream processing" }
    ]
  },
  {
    category: "Transformations",
    icon: FileCode,
    color: "text-purple-400",
    components: [
      { name: "Data Cleaner", description: "Remove duplicates, validate" },
      { name: "Field Mapper", description: "Transform field names" },
      { name: "Filter Rows", description: "Conditional filtering" },
      { name: "Aggregator", description: "Group and summarize" },
      { name: "JSON Parser", description: "Parse JSON fields" }
    ]
  },
  {
    category: "Destinations",
    icon: Server,
    color: "text-green-400",
    components: [
      { name: "Snowflake", description: "Cloud data warehouse" },
      { name: "BigQuery", description: "Google analytics warehouse" },
      { name: "S3 Bucket", description: "AWS object storage" },
      { name: "Email Alert", description: "Send notifications" },
      { name: "Webhook", description: "HTTP POST endpoint" }
    ]
  },
  {
    category: "Data Quality",
    icon: Filter,
    color: "text-yellow-400",
    components: [
      { name: "Validator", description: "Data validation rules" },
      { name: "Profiler", description: "Data quality metrics" },
      { name: "Anomaly Detector", description: "Detect outliers" },
      { name: "Schema Enforcer", description: "Ensure data structure" }
    ]
  },
  {
    category: "Analytics",
    icon: BarChart,
    color: "text-orange-400",
    components: [
      { name: "Trend Analysis", description: "Time series analysis" },
      { name: "Correlation", description: "Find relationships" },
      { name: "Forecasting", description: "Predict future values" },
      { name: "Clustering", description: "Group similar data" }
    ]
  }
]

export default function PipelineBuilder() {
  const location = useLocation()
  const { toast } = useToast()
  
  const [pipelineName, setPipelineName] = useState("Customer Data ETL")
  const [description, setDescription] = useState("")
  const [schedule, setSchedule] = useState("0 0 * * *")
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [pipelineNodes, setPipelineNodes] = useState<PipelineNode[]>([])
  const [isSaved, setIsSaved] = useState(true)
  const [templateNodes, setTemplateNodes] = useState<any[]>([])

  // Load template data if navigated from templates
  useEffect(() => {
    const template = location.state?.template
    if (template) {
      setPipelineName(template.name)
      setDescription(template.description)
      
      // Use template nodes if available
      if (template.nodes) {
        setTemplateNodes(template.nodes)
      } else {
        // Fallback to creating nodes from sources/destinations
        const nodes: any[] = []
        
        template.sources?.forEach((source: string, index: number) => {
          nodes.push({
            id: `source-${index}`,
            type: 'source',
            name: source,
            config: {},
            position: { x: 100 + (index * 300), y: 100 },
            status: 'idle'
          })
        })
        
        nodes.push({
          id: 'transform-1',
          type: 'transform',
          name: 'Data Processor',
          config: {},
          position: { x: 400, y: 200 },
          status: 'idle'
        })
        
        template.destinations?.forEach((dest: string, index: number) => {
          nodes.push({
            id: `dest-${index}`,
            type: 'destination',
            name: dest,
            config: {},
            position: { x: 700 + (index * 300), y: 100 },
            status: 'idle'
          })
        })
        
        setTemplateNodes(nodes)
      }
      
      toast({
        title: "Template Loaded",
        description: `${template.name} template has been applied to your pipeline`,
      })
    }
  }, [location.state, toast])

  const handleSave = () => {
    const pipelineData = {
      name: pipelineName,
      description,
      schedule,
      nodes: pipelineNodes,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
    
    const savedPipelines = JSON.parse(localStorage.getItem('savedPipelines') || '[]')
    const existingIndex = savedPipelines.findIndex((p: any) => p.name === pipelineName)
    
    if (existingIndex >= 0) {
      savedPipelines[existingIndex] = { ...pipelineData, updated: new Date().toISOString() }
    } else {
      savedPipelines.push(pipelineData)
    }
    
    localStorage.setItem('savedPipelines', JSON.stringify(savedPipelines))
    setIsSaved(true)
    
    toast({
      title: "Pipeline Saved",
      description: `Pipeline "${pipelineName}" has been saved successfully`,
    })
  }

  const handleComponentSelect = (categoryName: string, componentName: string) => {
    setSelectedComponent(`${categoryName}-${componentName}`)
  }

  const handleComponentUsed = () => {
    setSelectedComponent(null)
    setIsSaved(false)
  }

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline Builder</h1>
          <p className="text-muted-foreground mt-2">
            Design and configure your data pipelines visually
          </p>
        </div>
        <div className="flex gap-2">
          <PipelineConfigModal
            trigger={
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            }
          />
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={isSaved}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Builder Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6">
        {/* Pipeline Canvas */}
        <div className="col-span-9">
          <DraggablePipelineCanvas 
            selectedComponent={selectedComponent}
            onComponentUsed={handleComponentUsed}
            initialNodes={templateNodes}
            onNodesChange={setPipelineNodes}
          />
        </div>

        {/* Properties Panel */}
        <div className="col-span-3 space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Pipeline Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pipeline-name">Pipeline Name</Label>
                <Input 
                  id="pipeline-name" 
                  value={pipelineName}
                  onChange={(e) => {
                    setPipelineName(e.target.value)
                    setIsSaved(false)
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Describe your pipeline..." 
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    setIsSaved(false)
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Input 
                  id="schedule" 
                  value={schedule}
                  onChange={(e) => {
                    setSchedule(e.target.value)
                    setIsSaved(false)
                  }}
                  placeholder="Cron expression"
                  className="mt-1"
                />
              </div>
              
              {/* Pipeline Stats */}
              <div className="pt-4 border-t">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nodes:</span>
                    <span className="text-foreground">{pipelineNodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sources:</span>
                    <span className="text-foreground">
                      {pipelineNodes.filter(n => n.type === 'source').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transforms:</span>
                    <span className="text-foreground">
                      {pipelineNodes.filter(n => n.type === 'transform').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destinations:</span>
                    <span className="text-foreground">
                      {pipelineNodes.filter(n => n.type === 'destination').length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Component Library</CardTitle>
              {selectedComponent && (
                <Badge variant="secondary" className="mt-2">
                  Selected: {selectedComponent.split('-').slice(1).join(' ')}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {componentLibrary.map((category) => {
                  const Icon = category.icon
                  return (
                    <div key={category.category}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`h-4 w-4 ${category.color}`} />
                        <span className="text-sm font-medium text-foreground">
                          {category.category}
                        </span>
                      </div>
                      <div className="space-y-1 ml-6">
                        {category.components.map((component) => (
                          <Button
                            key={component.name}
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start h-auto p-2 ${
                              selectedComponent === `${category.category}-${component.name}`
                                ? 'bg-primary/10 text-primary border border-primary/50'
                                : ''
                            }`}
                            onClick={() => handleComponentSelect(category.category, component.name)}
                          >
                            <div className="text-left">
                              <div className="text-xs font-medium">{component.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {component.description}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
