
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Database, Cloud, FileText, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImportDataModalProps {
  trigger: React.ReactNode
}

export function ImportDataModal({ trigger }: ImportDataModalProps) {
  const [importType, setImportType] = useState<string>("")
  const [connectionString, setConnectionString] = useState<string>("")
  const [apiUrl, setApiUrl] = useState<string>("")
  const [apiHeaders, setApiHeaders] = useState<string>('{"Authorization": "Bearer your-token"}')
  const [mongoQuery, setMongoQuery] = useState<string>('{}')
  const [fileName, setFileName] = useState<string>("")
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const handleImport = async () => {
    if (!importType) {
      toast({
        title: "Error",
        description: "Please select an import type",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    
    try {
      toast({
        title: "Import Started",
        description: `Starting ${importType} import...`,
      })

      // Simulate actual import process
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Simulate success/failure
      const success = Math.random() > 0.2 // 80% success rate
      
      if (success) {
        const recordCount = Math.floor(Math.random() * 10000) + 1000
        toast({
          title: "Import Complete",
          description: `Successfully imported ${recordCount.toLocaleString()} records from ${importType}`,
        })
      } else {
        throw new Error("Connection failed")
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Could not connect to data source. Please check your connection details.",
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
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
                <SelectItem value="mongodb">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    MongoDB
                  </div>
                </SelectItem>
                <SelectItem value="postgresql">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    PostgreSQL
                  </div>
                </SelectItem>
                <SelectItem value="mysql">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    MySQL
                  </div>
                </SelectItem>
                <SelectItem value="api">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    REST API
                  </div>
                </SelectItem>
                <SelectItem value="cloud">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    Cloud Storage
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {importType === "csv" && (
            <div>
              <Label htmlFor="file">Upload CSV File</Label>
              <Input 
                type="file" 
                accept=".csv,.xlsx,.json"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
              {fileName && (
                <p className="text-sm text-muted-foreground mt-1">Selected: {fileName}</p>
              )}
            </div>
          )}

          {(importType === "mongodb" || importType === "postgresql" || importType === "mysql") && (
            <>
              <div>
                <Label htmlFor="connection">Connection String</Label>
                <Input 
                  placeholder={importType === "mongodb" 
                    ? "mongodb://username:password@host:port/database"
                    : "postgresql://username:password@host:port/database"
                  }
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                />
              </div>
              {importType === "mongodb" && (
                <div>
                  <Label htmlFor="query">MongoDB Query (JSON)</Label>
                  <Textarea
                    placeholder='{"status": "active"}'
                    value={mongoQuery}
                    onChange={(e) => setMongoQuery(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </>
          )}

          {importType === "api" && (
            <>
              <div>
                <Label htmlFor="api-url">API Endpoint URL</Label>
                <Input 
                  placeholder="https://api.example.com/data"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="headers">Headers (JSON)</Label>
                <Textarea
                  placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                  value={apiHeaders}
                  onChange={(e) => setApiHeaders(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          {importType === "cloud" && (
            <div>
              <Label htmlFor="cloud-path">Cloud Storage Path</Label>
              <Input 
                placeholder="s3://bucket-name/path/to/data or gs://bucket/path"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleImport} 
              className="flex-1"
              disabled={isImporting}
            >
              {isImporting ? "Importing..." : "Start Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
