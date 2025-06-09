
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface NodeConfigModalProps {
  isOpen: boolean
  onClose: () => void
  node: any
  onSave: (config: any) => void
}

export function NodeConfigModal({ isOpen, onClose, node, onSave }: NodeConfigModalProps) {
  const [config, setConfig] = useState(node?.config || {})
  const { toast } = useToast()

  const handleSave = () => {
    onSave(config)
    toast({
      title: "Configuration Saved",
      description: `${node?.name} configuration updated`
    })
    onClose()
  }

  if (!node) return null

  const renderSourceConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Connection String</Label>
        <Input 
          value={config.connectionString || ''} 
          onChange={(e) => setConfig({...config, connectionString: e.target.value})}
          placeholder="mongodb://localhost:27017/mydb"
        />
      </div>
      <div>
        <Label>Database Name</Label>
        <Input 
          value={config.database || ''} 
          onChange={(e) => setConfig({...config, database: e.target.value})}
          placeholder="mydb"
        />
      </div>
      <div>
        <Label>Collection/Table</Label>
        <Input 
          value={config.collection || ''} 
          onChange={(e) => setConfig({...config, collection: e.target.value})}
          placeholder="users"
        />
      </div>
    </div>
  )

  const renderTransformConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Transformation Type</Label>
        <Select value={config.type || ''} onValueChange={(value) => setConfig({...config, type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select transformation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="filter">Filter Rows</SelectItem>
            <SelectItem value="map">Field Mapping</SelectItem>
            <SelectItem value="aggregate">Aggregation</SelectItem>
            <SelectItem value="clean">Data Cleaning</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Transformation Rules</Label>
        <Textarea 
          value={config.rules || ''} 
          onChange={(e) => setConfig({...config, rules: e.target.value})}
          placeholder="Enter transformation logic..."
          className="min-h-20"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch 
          checked={config.validateData || false}
          onCheckedChange={(checked) => setConfig({...config, validateData: checked})}
        />
        <Label>Validate data after transformation</Label>
      </div>
    </div>
  )

  const renderDestinationConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Destination Type</Label>
        <Select value={config.destinationType || ''} onValueChange={(value) => setConfig({...config, destinationType: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="api">API Endpoint</SelectItem>
            <SelectItem value="file">File Storage</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Connection Details</Label>
        <Input 
          value={config.connection || ''} 
          onChange={(e) => setConfig({...config, connection: e.target.value})}
          placeholder="Connection string or endpoint"
        />
      </div>
      <div>
        <Label>Target Table/Collection</Label>
        <Input 
          value={config.target || ''} 
          onChange={(e) => setConfig({...config, target: e.target.value})}
          placeholder="target_table"
        />
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure {node.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Node Name</Label>
            <Input 
              value={config.name || node.name} 
              onChange={(e) => setConfig({...config, name: e.target.value})}
            />
          </div>
          
          {node.type === 'source' && renderSourceConfig()}
          {node.type === 'transform' && renderTransformConfig()}
          {node.type === 'destination' && renderDestinationConfig()}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">Save Configuration</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
