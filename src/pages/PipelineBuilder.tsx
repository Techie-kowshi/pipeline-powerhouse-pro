
import { useState } from "react"
import { PipelineCanvas } from "@/components/builder/PipelineCanvas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Play, Settings } from "lucide-react"
import { PipelineConfigModal } from "@/components/modals/PipelineConfigModal"
import { useToast } from "@/hooks/use-toast"

export default function PipelineBuilder() {
  const [pipelineName, setPipelineName] = useState("Customer Data ETL")
  const [description, setDescription] = useState("")
  const [schedule, setSchedule] = useState("0 0 * * *")
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Pipeline Saved",
      description: `Pipeline "${pipelineName}" has been saved successfully`,
    })
  }

  const handleRun = () => {
    toast({
      title: "Pipeline Started",
      description: `Pipeline "${pipelineName}" is now running`,
    })
  }

  const handleComponentAdd = (componentType: string) => {
    toast({
      title: "Component Added",
      description: `${componentType} component added to pipeline`,
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
          <PipelineConfigModal
            trigger={
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            }
          />
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={handleRun}>
            <Play className="h-4 w-4 mr-2" />
            Run Pipeline
          </Button>
        </div>
      </div>

      {/* Builder Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6">
        {/* Pipeline Canvas */}
        <div className="col-span-9">
          <PipelineCanvas />
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
                  onChange={(e) => setPipelineName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Describe your pipeline..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Input 
                  id="schedule" 
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="Cron expression"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Component Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleComponentAdd("Data Sources")}
                >
                  <span>📊 Data Sources</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleComponentAdd("Transformations")}
                >
                  <span>🔄 Transformations</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleComponentAdd("Destinations")}
                >
                  <span>📤 Destinations</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleComponentAdd("Data Quality")}
                >
                  <span>🔍 Data Quality</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => handleComponentAdd("Analytics")}
                >
                  <span>📈 Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
