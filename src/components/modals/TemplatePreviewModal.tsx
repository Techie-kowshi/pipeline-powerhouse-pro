
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Database, FileCode, Server, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Template {
  id: string
  name: string
  description: string
  category: string
  estimatedTime: string
  rating: number
  uses: number
  sources: string[]
  destinations: string[]
  nodes?: Array<{
    id: string
    type: 'source' | 'transform' | 'destination'
    name: string
    config: any
    position: { x: number; y: number }
  }>
}

interface TemplatePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  template: Template | null
  onUse?: (template: Template) => void
}

export function TemplatePreviewModal({ isOpen, onClose, template, onUse }: TemplatePreviewModalProps) {
  const { toast } = useToast()

  const handleUse = () => {
    if (template) {
      onUse?.(template)
      toast({
        title: "Template Applied",
        description: `${template.name} has been loaded into the pipeline builder`
      })
      onClose()
    }
  }

  if (!template) return null

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'source': return Database
      case 'transform': return FileCode
      case 'destination': return Server
      default: return Database
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Template Preview: {template.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground">{template.description}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{template.category}</Badge>
              <Badge variant="outline">Est. {template.estimatedTime}</Badge>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Pipeline Flow</h4>
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {/* Sources */}
              {template.sources.map((source: string, index: number) => {
                const Icon = getNodeIcon('source')
                return (
                  <div key={`source-${index}`} className="flex items-center gap-2">
                    <Card className="min-w-32 bg-blue-500/10 border-blue-500/50">
                      <CardContent className="p-3 text-center">
                        <Icon className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                        <p className="text-xs font-medium">{source}</p>
                        <Badge variant="secondary" className="text-xs mt-1">Source</Badge>
                      </CardContent>
                    </Card>
                    {index < template.sources.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                )
              })}
              
              {/* Transform */}
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Card className="min-w-32 bg-purple-500/10 border-purple-500/50">
                  <CardContent className="p-3 text-center">
                    <FileCode className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs font-medium">Transform</p>
                    <Badge variant="secondary" className="text-xs mt-1">Process</Badge>
                  </CardContent>
                </Card>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Destinations */}
              {template.destinations.map((dest: string, index: number) => {
                const Icon = getNodeIcon('destination')
                return (
                  <div key={`dest-${index}`} className="flex items-center gap-2">
                    <Card className="min-w-32 bg-green-500/10 border-green-500/50">
                      <CardContent className="p-3 text-center">
                        <Icon className="h-6 w-6 text-green-400 mx-auto mb-1" />
                        <p className="text-xs font-medium">{dest}</p>
                        <Badge variant="secondary" className="text-xs mt-1">Destination</Badge>
                      </CardContent>
                    </Card>
                    {index < template.destinations.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Features</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time data processing</li>
                <li>• Error handling and retries</li>
                <li>• Data validation</li>
                <li>• Monitoring and alerts</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Use Cases</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Data migration</li>
                <li>• Real-time analytics</li>
                <li>• Data synchronization</li>
                <li>• ETL operations</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleUse} className="flex-1">
              Use This Template
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
