
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Database, Cloud, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImportDataModalProps {
  trigger: React.ReactNode
}

export function ImportDataModal({ trigger }: ImportDataModalProps) {
  const [importType, setImportType] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [connectionString, setConnectionString] = useState<string>("")
  const { toast } = useToast()

  const handleImport = () => {
    if (!importType) {
      toast({
        title: "Error",
        description: "Please select an import type",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Import Started",
      description: `${importType} import has been initiated. You'll be notified when complete.`,
    })

    // Simulate import process
    setTimeout(() => {
      toast({
        title: "Import Complete",
        description: `Successfully imported data from ${importType}`,
      })
    }, 3000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="import-type">Import Type</Label>
            <Select value={importType} onValueChange={setImportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select import source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV File
                  </div>
                </SelectItem>
                <SelectItem value="database">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database
                  </div>
                </SelectItem>
                <SelectItem value="api">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    API Endpoint
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {importType === "csv" && (
            <div>
              <Label htmlFor="file">File Upload</Label>
              <Input 
                type="file" 
                accept=".csv,.xlsx,.json"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </div>
          )}

          {importType === "database" && (
            <div>
              <Label htmlFor="connection">Connection String</Label>
              <Input 
                placeholder="postgresql://user:password@host:port/database"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
              />
            </div>
          )}

          {importType === "api" && (
            <div>
              <Label htmlFor="api-url">API URL</Label>
              <Input 
                placeholder="https://api.example.com/data"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleImport} className="flex-1">
              Start Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
