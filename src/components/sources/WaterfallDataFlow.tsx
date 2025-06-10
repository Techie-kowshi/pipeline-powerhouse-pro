
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDown, Database, Filter, Upload, CheckCircle } from "lucide-react"

interface WaterfallStage {
  id: string
  name: string
  type: 'source' | 'transform' | 'validate' | 'load'
  status: 'idle' | 'processing' | 'complete' | 'error'
  progress: number
  recordsProcessed: number
  totalRecords: number
  duration: number
  throughput: string
}

export function WaterfallDataFlow() {
  const [stages, setStages] = useState<WaterfallStage[]>([
    {
      id: 'extract',
      name: 'Data Extraction',
      type: 'source',
      status: 'idle',
      progress: 0,
      recordsProcessed: 0,
      totalRecords: 100000,
      duration: 0,
      throughput: '0 records/sec'
    },
    {
      id: 'transform',
      name: 'Data Transformation',
      type: 'transform',
      status: 'idle',
      progress: 0,
      recordsProcessed: 0,
      totalRecords: 100000,
      duration: 0,
      throughput: '0 records/sec'
    },
    {
      id: 'validate',
      name: 'Data Validation',
      type: 'validate',
      status: 'idle',
      progress: 0,
      recordsProcessed: 0,
      totalRecords: 100000,
      duration: 0,
      throughput: '0 records/sec'
    },
    {
      id: 'load',
      name: 'Data Loading',
      type: 'load',
      status: 'idle',
      progress: 0,
      recordsProcessed: 0,
      totalRecords: 100000,
      duration: 0,
      throughput: '0 records/sec'
    }
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [currentStageIndex, setCurrentStageIndex] = useState(-1)

  const startWaterfall = async () => {
    setIsRunning(true)
    setCurrentStageIndex(0)
    
    // Reset all stages
    setStages(prev => prev.map(stage => ({
      ...stage,
      status: 'idle',
      progress: 0,
      recordsProcessed: 0,
      duration: 0,
      throughput: '0 records/sec'
    })))

    // Process each stage sequentially
    for (let i = 0; i < stages.length; i++) {
      setCurrentStageIndex(i)
      await processStage(i)
    }
    
    setIsRunning(false)
    setCurrentStageIndex(-1)
  }

  const processStage = (stageIndex: number) => {
    return new Promise<void>((resolve) => {
      const stageId = stages[stageIndex].id
      const totalRecords = stages[stageIndex].totalRecords
      const processingTime = 3000 + Math.random() * 2000 // 3-5 seconds
      const interval = 100 // Update every 100ms
      const recordsPerUpdate = totalRecords / (processingTime / interval)
      
      setStages(prev => prev.map(stage => 
        stage.id === stageId ? { ...stage, status: 'processing' } : stage
      ))
      
      let processed = 0
      let startTime = Date.now()
      
      const progressInterval = setInterval(() => {
        processed += recordsPerUpdate
        const currentTime = Date.now()
        const elapsed = (currentTime - startTime) / 1000
        const throughputValue = Math.round(processed / elapsed)
        
        if (processed >= totalRecords) {
          processed = totalRecords
          clearInterval(progressInterval)
          
          setStages(prev => prev.map(stage => 
            stage.id === stageId ? {
              ...stage,
              status: 'complete',
              progress: 100,
              recordsProcessed: totalRecords,
              duration: elapsed,
              throughput: `${throughputValue.toLocaleString()} records/sec`
            } : stage
          ))
          
          resolve()
        } else {
          const progress = (processed / totalRecords) * 100
          
          setStages(prev => prev.map(stage => 
            stage.id === stageId ? {
              ...stage,
              progress,
              recordsProcessed: Math.round(processed),
              duration: elapsed,
              throughput: `${throughputValue.toLocaleString()} records/sec`
            } : stage
          ))
        }
      }, interval)
    })
  }

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'source': return Database
      case 'transform': return Filter
      case 'validate': return CheckCircle
      case 'load': return Upload
      default: return Database
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-500'
      case 'complete': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-300'
    }
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ArrowDown className="h-5 w-5" />
            Waterfall Data Pipeline
          </CardTitle>
          <Button 
            onClick={startWaterfall}
            disabled={isRunning}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isRunning ? 'Processing...' : 'Start Pipeline'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const Icon = getStageIcon(stage.type)
            const isActive = currentStageIndex === index
            const isComplete = stage.status === 'complete'
            const isProcessing = stage.status === 'processing'
            
            return (
              <div key={stage.id} className="relative">
                <div className={`
                  p-4 rounded-lg border-2 transition-all duration-500
                  ${isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-105' : 
                    isComplete ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 
                    'border-gray-200 bg-white dark:bg-gray-800'}
                `}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`
                        p-2 rounded-full transition-colors duration-300
                        ${isProcessing ? 'bg-blue-500 animate-pulse' :
                          isComplete ? 'bg-green-500' : 'bg-gray-300'}
                      `}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{stage.name}</h4>
                        <Badge variant={
                          isProcessing ? 'default' :
                          isComplete ? 'secondary' : 'outline'
                        } className="text-xs">
                          {stage.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right text-sm">
                      <div className="font-medium">
                        {stage.recordsProcessed.toLocaleString()} / {stage.totalRecords.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {stage.throughput}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{Math.round(stage.progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`
                          h-full transition-all duration-300 ease-out
                          ${isProcessing ? 'bg-blue-500' :
                            isComplete ? 'bg-green-500' : 'bg-gray-300'}
                        `}
                        style={{ width: `${stage.progress}%` }}
                      />
                    </div>
                    {stage.duration > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Duration: {stage.duration.toFixed(1)}s
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Waterfall flow arrow */}
                {index < stages.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowDown className={`
                      h-6 w-6 transition-colors duration-300
                      ${isComplete ? 'text-green-500' : 'text-gray-300'}
                    `} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
