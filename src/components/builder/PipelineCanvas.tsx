import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Database, FileCode, Server, Settings, Trash2, Play, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NodeConfigModal } from "@/components/modals/NodeConfigModal"

interface PipelineNode {
  id: string
  type: 'source' | 'transform' | 'destination'
  name: string
  config: any
  position: { x: number; y: number }
  status: 'idle' | 'running' | 'success' | 'error'
}

interface PipelineCanvasProps {
  onNodeAdd?: (node: PipelineNode) => void
  selectedComponent?: string | null
  onComponentUsed?: () => void
}

export function PipelineCanvas({ onNodeAdd, selectedComponent, onComponentUsed }: PipelineCanvasProps) {
  const [nodes, setNodes] = useState<PipelineNode[]>([
    {
      id: '1',
      type: 'source',
      name: 'MongoDB Source',
      config: { connectionString: 'mongodb://localhost:27017', database: 'mydb', collection: 'users' },
      position: { x: 100, y: 150 },
      status: 'success'
    },
    {
      id: '2',
      type: 'transform',
      name: 'Data Cleaner',
      config: { type: 'clean', rules: 'remove_duplicates,validate_emails', validateData: true },
      position: { x: 400, y: 150 },
      status: 'running'
    },
    {
      id: '3',
      type: 'destination',
      name: 'Data Warehouse',
      config: { destinationType: 'database', connection: 'snowflake://warehouse', target: 'customers' },
      position: { x: 700, y: 150 },
      status: 'idle'
    }
  ])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [configModalNode, setConfigModalNode] = useState<PipelineNode | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  const addNode = (type: 'source' | 'transform' | 'destination', componentName?: string) => {
    const name = componentName || `New ${type}`
    const newNode: PipelineNode = {
      id: Date.now().toString(),
      type,
      name,
      config: {},
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 200 + 100 
      },
      status: 'idle'
    }
    
    setNodes(prev => [...prev, newNode])
    onNodeAdd?.(newNode)
    
    toast({
      title: "Node Added",
      description: `${name} added to pipeline`
    })
  }

  const addSelectedComponent = () => {
    if (!selectedComponent) return
    
    const [category, componentName] = selectedComponent.split('-')
    let nodeType: 'source' | 'transform' | 'destination' = 'transform'
    
    if (category.includes('Sources')) nodeType = 'source'
    else if (category.includes('Destinations')) nodeType = 'destination'
    else if (category.includes('Quality') || category.includes('Analytics')) nodeType = 'transform'
    
    addNode(nodeType, componentName)
    onComponentUsed?.()
  }

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setSelectedNode(null)
    toast({
      title: "Node Deleted",
      description: "Node removed from pipeline"
    })
  }

  const openNodeConfig = (node: PipelineNode) => {
    setConfigModalNode(node)
  }

  const saveNodeConfig = (config: any) => {
    if (!configModalNode) return
    
    setNodes(prev => prev.map(node => 
      node.id === configModalNode.id 
        ? { ...node, config, name: config.name || node.name }
        : node
    ))
    setConfigModalNode(null)
  }

  const runPipeline = async () => {
    if (nodes.length === 0) {
      toast({
        title: "No Nodes",
        description: "Add some nodes to your pipeline first",
        variant: "destructive"
      })
      return
    }

    setIsRunning(true)
    toast({
      title: "Pipeline Started",
      description: "Running pipeline nodes in sequence..."
    })

    // Simulate pipeline execution
    for (let i = 0; i < nodes.length; i++) {
      setNodes(prev => prev.map((node, index) => ({
        ...node,
        status: index === i ? 'running' : index < i ? 'success' : 'idle'
      })))
      
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    setNodes(prev => prev.map(node => ({ ...node, status: 'success' })))
    setIsRunning(false)
    
    toast({
      title: "Pipeline Complete",
      description: "All nodes executed successfully"
    })
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'source': return Database
      case 'transform': return FileCode
      case 'destination': return Server
      default: return Database
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500'
      case 'success': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="h-full bg-muted/10 rounded-lg border border-border/50 relative overflow-hidden">
      {/* Canvas Header */}
      <div className="p-4 border-b border-border/50 bg-card/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Pipeline Canvas</h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addNode('source')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addNode('transform')}
            >
              <FileCode className="h-4 w-4 mr-2" />
              Add Transform
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addNode('destination')}
            >
              <Server className="h-4 w-4 mr-2" />
              Add Destination
            </Button>
            {selectedComponent && (
              <Button 
                size="sm"
                variant="default"
                onClick={addSelectedComponent}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {selectedComponent.split('-').slice(1).join(' ')}
              </Button>
            )}
            <Button 
              size="sm"
              onClick={runPipeline}
              disabled={isRunning}
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Pipeline'}
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="p-8 h-full relative">
        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {nodes.map((node, index) => {
            if (index < nodes.length - 1) {
              const nextNode = nodes[index + 1]
              return (
                <line
                  key={`line-${node.id}`}
                  x1={node.position.x + 190}
                  y1={node.position.y + 60}
                  x2={nextNode.position.x}
                  y2={nextNode.position.y + 60}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className={isRunning ? "animate-pulse" : ""}
                />
              )
            }
            return null
          })}
        </svg>

        {/* Pipeline Nodes */}
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type)
          return (
            <Card 
              key={node.id}
              className={`absolute w-48 p-4 cursor-pointer transition-all duration-200 ${
                selectedNode === node.id ? 'ring-2 ring-primary' : ''
              } ${
                node.type === 'source' ? 'bg-blue-500/10 border-blue-500/50 hover:bg-blue-500/20' :
                node.type === 'transform' ? 'bg-purple-500/10 border-purple-500/50 hover:bg-purple-500/20' :
                'bg-green-500/10 border-green-500/50 hover:bg-green-500/20'
              }`}
              style={{ 
                left: node.position.x, 
                top: node.position.y,
                zIndex: 2 
              }}
              onClick={() => setSelectedNode(node.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`h-5 w-5 ${
                  node.type === 'source' ? 'text-blue-400' :
                  node.type === 'transform' ? 'text-purple-400' :
                  'text-green-400'
                }`} />
                <span className="font-medium text-foreground text-sm">{node.name}</span>
                <div className={`h-2 w-2 rounded-full ${getStatusColor(node.status)} ${
                  node.status === 'running' ? 'animate-pulse' : ''
                }`}></div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {Object.keys(node.config).length > 0 ? 'Configured' : 'Not configured'}
              </p>
              
              <div className="flex gap-1 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {node.status}
                </Badge>
              </div>

              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 px-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    openNodeConfig(node)
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 px-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNode(node.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          )
        })}

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Start building your pipeline</p>
              <p className="text-sm">Add sources, transformations, and destinations</p>
            </div>
          </div>
        )}
      </div>

      {/* Node Configuration Modal */}
      <NodeConfigModal 
        isOpen={!!configModalNode}
        onClose={() => setConfigModalNode(null)}
        node={configModalNode}
        onSave={saveNodeConfig}
      />
    </div>
  )
}
