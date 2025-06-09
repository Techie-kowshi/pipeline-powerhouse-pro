
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileCode, Clock, Star, Download, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TemplateCardProps {
  template: {
    id: string
    name: string
    description: string
    category: string
    estimatedTime: string
    rating: number
    uses: number
    sources: string[]
    destinations: string[]
  }
  onUse?: (template: any) => void
  onPreview?: (template: any) => void
}

export function TemplateCard({ template, onUse, onPreview }: TemplateCardProps) {
  const { toast } = useToast()

  const handleUseTemplate = () => {
    toast({
      title: "Template Applied",
      description: `${template.name} has been added to your pipeline builder`,
    })
    onUse?.(template)
  }

  const handlePreview = () => {
    toast({
      title: "Template Preview",
      description: `Opening preview for ${template.name}`,
    })
    onPreview?.(template)
  }

  const handleDownload = () => {
    // Simulate template download
    const templateData = {
      ...template,
      pipeline: {
        nodes: [
          { type: 'source', name: template.sources[0] || 'Data Source' },
          { type: 'transform', name: 'Data Processor' },
          { type: 'destination', name: template.destinations[0] || 'Data Warehouse' }
        ]
      }
    }
    
    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name.replace(/\s+/g, '_').toLowerCase()}_template.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Template Downloaded",
      description: `${template.name} template file has been downloaded`,
    })
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base text-foreground">{template.name}</CardTitle>
              <Badge variant="secondary" className="mt-1 text-xs">
                {template.category}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm">{template.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {template.description}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Est. setup time:</span>
            <span className="text-foreground font-medium">{template.estimatedTime}</span>
          </div>
          
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Sources:</p>
            <div className="flex flex-wrap gap-1">
              {template.sources.map((source) => (
                <Badge key={source} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Destinations:</p>
            <div className="flex flex-wrap gap-1">
              {template.destinations.map((dest) => (
                <Badge key={dest} variant="outline" className="text-xs">
                  {dest}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUseTemplate} className="flex-1">
              Use Template
            </Button>
            <Button size="sm" variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Used {template.uses.toLocaleString()} times
            </span>
            <Button size="sm" variant="ghost" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
