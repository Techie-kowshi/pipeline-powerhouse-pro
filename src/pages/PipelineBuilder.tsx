import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { DraggablePipelineCanvas } from "@/components/builder/DraggablePipelineCanvas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Play, Settings, Database, FileCode, Server, Filter, BarChart, Bot, Sparkles } from "lucide-react"
import { PipelineConfigModal } from "@/components/modals/PipelineConfigModal"
import { AIAssistantModal } from "@/components/modals/AIAssistantModal"
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
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [canvasKey, setCanvasKey] = useState(0) // Force canvas refresh

  // Load template data if navigated from templates
  useEffect(() => {
    const template = location.state?.template
    if (template) {
      console.log('Loading template:', template)
      
      setPipelineName(template.name)
      setDescription(template.description)
      
      // Convert template to proper node format
      let processedNodes: any[] = []
      
      if (template.nodes && template.nodes.length > 0) {
        // Use existing nodes if available
        processedNodes = template.nodes.map((node: any) => ({
          ...node,
          status: 'idle'
        }))
      } else {
        // Create nodes from sources/destinations
        let nodeIndex = 0
        
        template.sources?.forEach((source: string, index: number) => {
          processedNodes.push({
            id: `template-source-${nodeIndex++}`,
            type: 'source',
            name: source,
            config: {},
            position: { x: 100 + (index * 300), y: 100 },
            status: 'idle'
          })
        })
        
        if (template.sources && template.sources.length > 0) {
          processedNodes.push({
            id: `template-transform-${nodeIndex++}`,
            type: 'transform',
            name: 'Data Processor',
            config: {},
            position: { x: 400, y: 200 },
            status: 'idle'
          })
        }
        
        template.destinations?.forEach((dest: string, index: number) => {
          processedNodes.push({
            id: `template-dest-${nodeIndex++}`,
            type: 'destination',
            name: dest,
            config: {},
            position: { x: 700 + (index * 300), y: 100 },
            status: 'idle'
          })
        })
      }
      
      console.log('Processed template nodes:', processedNodes)
      setTemplateNodes(processedNodes)
      setCanvasKey(prev => prev + 1) // Force canvas refresh
      
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

  const handleNodesChange = (nodes: any[]) => {
    console.log('Nodes changed:', nodes)
    const convertedNodes: PipelineNode[] = nodes.map(node => ({
      id: node.id,
      type: node.data?.type || 'transform',
      name: node.data?.name || 'Unknown',
      config: node.data?.config || {},
      position: node.position,
      status: node.data?.status || 'idle'
    }))
    setPipelineNodes(convertedNodes)
    setIsSaved(false)
  }

  const handleAIGeneration = (suggestion: any) => {
    const newNodes = []
    
    // Add source nodes
    suggestion.sources?.forEach((source: any, index: number) => {
      newNodes.push({
        id: `ai-source-${index}`,
        type: 'source',
        name: source.name,
        config: source.config || {},
        position: { x: 100 + (index * 200), y: 100 },
        status: 'idle'
      })
    })
    
    // Add transform nodes
    suggestion.transforms?.forEach((transform: any, index: number) => {
      newNodes.push({
        id: `ai-transform-${index}`,
        type: 'transform',
        name: transform.name,
        config: transform.config || {},
        position: { x: 400, y: 100 + (index * 150) },
        status: 'idle'
      })
    })
    
    // Add destination nodes
    suggestion.destinations?.forEach((dest: any, index: number) => {
      newNodes.push({
        id: `ai-dest-${index}`,
        type: 'destination',
        name: dest.name,
        config: dest.config || {},
        position: { x: 700 + (index * 200), y: 100 },
        status: 'idle'
      })
    })
    
    setTemplateNodes(newNodes)
    setPipelineName(suggestion.name || "AI Generated Pipeline")
    setDescription(suggestion.description || "Pipeline created with AI assistance")
    setShowAIAssistant(false)
    setCanvasKey(prev => prev + 1)
    
    toast({
      title: "AI Pipeline Generated",
      description: "Your pipeline has been created with AI suggestions"
    })
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
          <Button 
            variant="outline" 
            onClick={() => setShowAIAssistant(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none hover:from-purple-600 hover:to-blue-600"
          >
            <Bot className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
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
            key={canvasKey}
            selectedComponent={selectedComponent}
            onComponentUsed={handleComponentUsed}
            initialNodes={templateNodes}
            onNodesChange={handleNodesChange}
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

      {/* AI Assistant Modal */}
      <AIAssistantModal 
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onGenerate={handleAIGeneration}
      />
    </div>
  )
}
