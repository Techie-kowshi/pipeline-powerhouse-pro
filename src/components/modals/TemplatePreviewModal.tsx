
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
      console.log('Using template:', template)
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

  // Use actual nodes if available, otherwise create from sources/destinations
  const previewNodes = template.nodes || [
    ...template.sources.map((source, index) => ({
      id: `preview-source-${index}`,
      type: 'source' as const,
      name: source,
      config: {},
      position: { x: 0, y: 0 }
    })),
    {
      id: 'preview-transform',
      type: 'transform' as const,
      name: 'Data Processor',
      config: {},
      position: { x: 0, y: 0 }
    },
    ...template.destinations.map((dest, index) => ({
      id: `preview-dest-${index}`,
      type: 'destination' as const,
      name: dest,
      config: {},
      position: { x: 0, y: 0 }
    }))
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Template Preview: {template.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground">{template.description}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{template.category}</Badge>
              <Badge variant="outline">Est. {template.estimatedTime}</Badge>
              <Badge variant="outline">{template.uses.toLocaleString()} uses</Badge>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Pipeline Structure</h4>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {previewNodes.map((node, index) => {
                const Icon = getNodeIcon(node.type)
                return (
                  <div key={node.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded ${
                      node.type === 'source' ? 'bg-blue-500/10 text-blue-400' :
                      node.type === 'transform' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{node.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{node.type}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {node.type}
                    </Badge>
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
              <h5 className="font-medium mb-2">Benefits</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Quick setup and deployment</li>
                <li>• Pre-configured best practices</li>
                <li>• Tested and optimized</li>
                <li>• Community validated</li>
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
