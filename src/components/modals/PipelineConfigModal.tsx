
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PipelineConfigModalProps {
  trigger: React.ReactNode
}

export function PipelineConfigModal({ trigger }: PipelineConfigModalProps) {
  const [config, setConfig] = useState({
    retryAttempts: "3",
    timeout: "30",
    alertOnFailure: true,
    logLevel: "info",
    maxConcurrency: "5"
  })
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "Pipeline configuration has been updated successfully",
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pipeline Configuration
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="retry">Retry Attempts</Label>
            <Input 
              id="retry"
              type="number"
              value={config.retryAttempts}
              onChange={(e) => setConfig(prev => ({...prev, retryAttempts: e.target.value}))}
            />
          </div>

          <div>
            <Label htmlFor="timeout">Timeout (minutes)</Label>
            <Input 
              id="timeout"
              type="number"
              value={config.timeout}
              onChange={(e) => setConfig(prev => ({...prev, timeout: e.target.value}))}
            />
          </div>

          <div>
            <Label htmlFor="concurrency">Max Concurrency</Label>
            <Input 
              id="concurrency"
              type="number"
              value={config.maxConcurrency}
              onChange={(e) => setConfig(prev => ({...prev, maxConcurrency: e.target.value}))}
            />
          </div>

          <div>
            <Label htmlFor="log-level">Log Level</Label>
            <Select value={config.logLevel} onValueChange={(value) => setConfig(prev => ({...prev, logLevel: value}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="alerts">Alert on Failure</Label>
            <Switch 
              id="alerts"
              checked={config.alertOnFailure}
              onCheckedChange={(checked) => setConfig(prev => ({...prev, alertOnFailure: checked}))}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
