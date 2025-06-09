
import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, FileCode, Server, Settings, Trash2, Play } from "lucide-react"
import { NodeConfigModal } from "@/components/modals/NodeConfigModal"
import { useToast } from "@/hooks/use-toast"

interface PipelineNode extends Node {
  data: {
    name: string
    type: 'source' | 'transform' | 'destination'
    config: any
    status: 'idle' | 'running' | 'success' | 'error'
  }
}

interface DraggablePipelineCanvasProps {
  selectedComponent?: string | null
  onComponentUsed?: () => void
  initialNodes?: any[]
  onNodesChange?: (nodes: PipelineNode[]) => void
}

const nodeTypes = {
  pipelineNode: ({ data, id, selected }: any) => {
    const [configModalOpen, setConfigModalOpen] = useState(false)
    const { toast } = useToast()

    const getIcon = () => {
      switch (data.type) {
        case 'source': return Database
        case 'transform': return FileCode
        case 'destination': return Server
        default: return Database
      }
    }

    const getStatusColor = () => {
      switch (data.status) {
        case 'running': return 'bg-blue-500'
        case 'success': return 'bg-green-500'
        case 'error': return 'bg-red-500'
        default: return 'bg-gray-500'
      }
    }

    const Icon = getIcon()

    return (
      <div className={`
        bg-card border-2 rounded-lg p-4 min-w-48 shadow-lg
        ${selected ? 'border-primary' : 'border-border'}
        ${data.type === 'source' ? 'bg-blue-500/10 border-blue-500/50' :
          data.type === 'transform' ? 'bg-purple-500/10 border-purple-500/50' :
          'bg-green-500/10 border-green-500/50'
        }
      `}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-5 w-5 ${
            data.type === 'source' ? 'text-blue-400' :
            data.type === 'transform' ? 'text-purple-400' :
            'text-green-400'
          }`} />
          <span className="font-medium text-sm">{data.name}</span>
          <div className={`h-2 w-2 rounded-full ${getStatusColor()} ${
            data.status === 'running' ? 'animate-pulse' : ''
          }`}></div>
        </div>
        
        <Badge variant="secondary" className="text-xs mb-2">
          {data.status}
        </Badge>
        
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-6 px-2"
            onClick={() => setConfigModalOpen(true)}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>

        <NodeConfigModal 
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          node={{ id, ...data }}
          onSave={(config) => {
            toast({
              title: "Configuration Updated",
              description: `${data.name} settings saved`
            })
          }}
        />
      </div>
    )
  }
}

export function DraggablePipelineCanvas({ 
  selectedComponent, 
  onComponentUsed, 
  initialNodes = [],
  onNodesChange 
}: DraggablePipelineCanvasProps) {
  const [nodes, setNodes, onNodesChangeHandler] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  // Load initial nodes
  useEffect(() => {
    if (initialNodes.length > 0) {
      const flowNodes = initialNodes.map((node, index) => ({
        id: node.id || `node-${index}`,
        type: 'pipelineNode',
        position: node.position || { x: 100 + index * 250, y: 100 },
        data: {
          name: node.name,
          type: node.type,
          config: node.config || {},
          status: 'idle'
        }
      }))
      setNodes(flowNodes)
      
      // Create connections between consecutive nodes
      const newEdges = []
      for (let i = 0; i < flowNodes.length - 1; i++) {
        newEdges.push({
          id: `edge-${i}`,
          source: flowNodes[i].id,
          target: flowNodes[i + 1].id,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed }
        })
      }
      setEdges(newEdges)
    }
  }, [initialNodes, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addNode = useCallback((type: 'source' | 'transform' | 'destination', name: string) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'pipelineNode',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        name,
        type,
        config: {},
        status: 'idle'
      }
    }
    setNodes((nds) => [...nds, newNode])
    onComponentUsed?.()
    
    toast({
      title: "Node Added",
      description: `${name} added to pipeline`
    })
  }, [setNodes, onComponentUsed, toast])

  const addSelectedComponent = useCallback(() => {
    if (!selectedComponent) return
    
    const [category, componentName] = selectedComponent.split('-')
    let nodeType: 'source' | 'transform' | 'destination' = 'transform'
    
    if (category.includes('Sources')) nodeType = 'source'
    else if (category.includes('Destinations')) nodeType = 'destination'
    
    addNode(nodeType, componentName)
  }, [selectedComponent, addNode])

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
      description: "Running pipeline nodes..."
    })

    // Simulate execution
    for (let i = 0; i < nodes.length; i++) {
      setNodes((nds) => nds.map((node, index) => ({
        ...node,
        data: {
          ...node.data,
          status: index === i ? 'running' : index < i ? 'success' : 'idle'
        }
      })))
      
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    setNodes((nds) => nds.map(node => ({
      ...node,
      data: { ...node.data, status: 'success' }
    })))
    
    setIsRunning(false)
    toast({
      title: "Pipeline Complete",
      description: "All nodes executed successfully"
    })
  }

  // Notify parent of node changes
  useEffect(() => {
    onNodesChange?.(nodes as PipelineNode[])
  }, [nodes, onNodesChange])

  return (
    <div className="h-full bg-muted/10 rounded-lg border border-border/50 relative">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-card/30 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pipeline Workspace</h3>
        <div className="flex gap-2">
          {selectedComponent && (
            <Button size="sm" onClick={addSelectedComponent}>
              Add {selectedComponent.split('-').slice(1).join(' ')}
            </Button>
          )}
          <Button size="sm" onClick={runPipeline} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="h-[calc(100%-80px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeHandler}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  )
}
