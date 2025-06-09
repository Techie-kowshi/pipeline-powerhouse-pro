
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Database, FileCode, Server } from "lucide-react"

export function PipelineCanvas() {
  return (
    <div className="h-full bg-muted/10 rounded-lg border border-border/50 relative overflow-hidden">
      {/* Canvas Header */}
      <div className="p-4 border-b border-border/50 bg-card/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Pipeline Canvas</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
            <Button size="sm" variant="outline">
              <FileCode className="h-4 w-4 mr-2" />
              Add Transform
            </Button>
            <Button size="sm" variant="outline">
              <Server className="h-4 w-4 mr-2" />
              Add Destination
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="p-8 h-full">
        {/* Sample Pipeline Nodes */}
        <div className="flex items-center justify-center gap-8 h-full">
          {/* Source Node */}
          <div className="relative">
            <Card className="w-48 p-4 bg-blue-500/10 border-blue-500/50 hover:bg-blue-500/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-foreground">PostgreSQL</span>
              </div>
              <p className="text-sm text-muted-foreground">Customer database</p>
              <div className="mt-3 flex gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Connected</span>
              </div>
            </Card>
            {/* Connection Line */}
            <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform -translate-y-1/2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 animate-data-flow"></div>
            </div>
          </div>

          {/* Transform Node */}
          <div className="relative">
            <Card className="w-48 p-4 bg-purple-500/10 border-purple-500/50 hover:bg-purple-500/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <FileCode className="h-5 w-5 text-purple-400" />
                <span className="font-medium text-foreground">Data Cleaner</span>
              </div>
              <p className="text-sm text-muted-foreground">Remove duplicates, validate emails</p>
              <div className="mt-3 flex gap-2">
                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-400">Processing</span>
              </div>
            </Card>
            {/* Connection Line */}
            <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-green-400 transform -translate-y-1/2">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-green-400 animate-data-flow"></div>
            </div>
          </div>

          {/* Destination Node */}
          <div>
            <Card className="w-48 p-4 bg-green-500/10 border-green-500/50 hover:bg-green-500/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Server className="h-5 w-5 text-green-400" />
                <span className="font-medium text-foreground">Data Warehouse</span>
              </div>
              <p className="text-sm text-muted-foreground">Snowflake destination</p>
              <div className="mt-3 flex gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Ready</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Empty State Help */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Drag and drop components to build your pipeline</p>
            <p className="text-xs mt-1">Use the toolbar above to add sources, transforms, and destinations</p>
          </div>
        </div>
      </div>
    </div>
  )
}
