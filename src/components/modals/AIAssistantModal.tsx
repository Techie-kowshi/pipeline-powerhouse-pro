
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bot, Sparkles, Database, FileCode, Server } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (suggestion: any) => void
}

const predefinedTemplates = [
  {
    name: "E-commerce Data Pipeline",
    description: "Process customer orders and analytics",
    sources: [{ name: "Shopify API", config: { apiKey: "", shopDomain: "" } }],
    transforms: [{ name: "Data Cleaner", config: { rules: "remove_duplicates" } }],
    destinations: [{ name: "Data Warehouse", config: { connectionString: "" } }]
  },
  {
    name: "Financial Analytics",
    description: "Process financial transactions",
    sources: [{ name: "Bank API", config: { apiKey: "", accountId: "" } }],
    transforms: [{ name: "Compliance Checker", config: { rules: "sox_compliance" } }],
    destinations: [{ name: "BigQuery", config: { projectId: "", dataset: "" } }]
  },
  {
    name: "IoT Data Processing",
    description: "Real-time sensor data analysis",
    sources: [{ name: "MQTT Broker", config: { brokerUrl: "", topics: "" } }],
    transforms: [{ name: "Anomaly Detector", config: { threshold: 3.0 } }],
    destinations: [{ name: "Time Series DB", config: { connectionString: "" } }]
  }
]

export function AIAssistantModal({ isOpen, onClose, onGenerate }: AIAssistantModalProps) {
  const [prompt, setPrompt] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSuggestion, setGeneratedSuggestion] = useState<any>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt && !selectedTemplate) {
      toast({
        title: "Input Required",
        description: "Please enter a prompt or select a template",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      let suggestion
      if (selectedTemplate) {
        const template = predefinedTemplates.find(t => t.name === selectedTemplate)
        suggestion = {
          name: template?.name || "Generated Pipeline",
          description: template?.description || prompt,
          sources: template?.sources || [],
          transforms: template?.transforms || [],
          destinations: template?.destinations || []
        }
      } else {
        // Generate based on prompt
        suggestion = generateFromPrompt(prompt)
      }

      setGeneratedSuggestion(suggestion)
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate pipeline. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFromPrompt = (prompt: string) => {
    const lowercasePrompt = prompt.toLowerCase()
    
    // Simple keyword-based generation
    const sources = []
    const transforms = []
    const destinations = []

    if (lowercasePrompt.includes('api') || lowercasePrompt.includes('rest')) {
      sources.push({ name: "REST API", config: { endpoint: "", apiKey: "" } })
    }
    if (lowercasePrompt.includes('database') || lowercasePrompt.includes('sql')) {
      sources.push({ name: "PostgreSQL", config: { connectionString: "" } })
    }
    if (lowercasePrompt.includes('mongo')) {
      sources.push({ name: "MongoDB", config: { connectionString: "" } })
    }
    if (lowercasePrompt.includes('csv') || lowercasePrompt.includes('file')) {
      sources.push({ name: "CSV File", config: { filePath: "" } })
    }

    if (lowercasePrompt.includes('clean') || lowercasePrompt.includes('validate')) {
      transforms.push({ name: "Data Cleaner", config: { rules: "remove_duplicates,validate_emails" } })
    }
    if (lowercasePrompt.includes('transform') || lowercasePrompt.includes('map')) {
      transforms.push({ name: "Field Mapper", config: { mappings: {} } })
    }
    if (lowercasePrompt.includes('filter')) {
      transforms.push({ name: "Filter Rows", config: { conditions: [] } })
    }

    if (lowercasePrompt.includes('warehouse') || lowercasePrompt.includes('bigquery')) {
      destinations.push({ name: "BigQuery", config: { projectId: "", dataset: "" } })
    }
    if (lowercasePrompt.includes('s3') || lowercasePrompt.includes('storage')) {
      destinations.push({ name: "S3 Bucket", config: { bucketName: "", region: "" } })
    }
    if (lowercasePrompt.includes('email') || lowercasePrompt.includes('alert')) {
      destinations.push({ name: "Email Alert", config: { recipients: [] } })
    }

    // Default fallback
    if (sources.length === 0) sources.push({ name: "REST API", config: {} })
    if (transforms.length === 0) transforms.push({ name: "Data Cleaner", config: {} })
    if (destinations.length === 0) destinations.push({ name: "Data Warehouse", config: {} })

    return {
      name: "AI Generated Pipeline",
      description: prompt,
      sources,
      transforms,
      destinations
    }
  }

  const handleUseGenerated = () => {
    if (generatedSuggestion) {
      onGenerate(generatedSuggestion)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500" />
            AI Pipeline Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quick Templates</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a pre-built template" />
              </SelectTrigger>
              <SelectContent>
                {predefinedTemplates.map((template) => (
                  <SelectItem key={template.name} value={template.name}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-center text-muted-foreground">OR</div>

          {/* Custom Prompt */}
          <div>
            <label className="text-sm font-medium mb-2 block">Describe Your Pipeline</label>
            <Textarea
              placeholder="E.g., 'Create a pipeline to sync customer data from Shopify API to PostgreSQL database with data cleaning'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || (!prompt && !selectedTemplate)}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Pipeline"}
          </Button>

          {/* Generated Suggestion */}
          {generatedSuggestion && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-2">{generatedSuggestion.name}</h4>
              <p className="text-sm text-muted-foreground mb-4">{generatedSuggestion.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium">Sources</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {generatedSuggestion.sources?.map((source: any, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {source.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileCode className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium">Transformations</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {generatedSuggestion.transforms?.map((transform: any, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {transform.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium">Destinations</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {generatedSuggestion.destinations?.map((dest: any, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {dest.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={handleUseGenerated} className="flex-1">
                  Use This Pipeline
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setGeneratedSuggestion(null)}
                >
                  Generate Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
