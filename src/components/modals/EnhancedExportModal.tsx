
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Download, FileText, Database, Cloud, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedExportModalProps {
  trigger: React.ReactNode
}

export function EnhancedExportModal({ trigger }: EnhancedExportModalProps) {
  const [exportType, setExportType] = useState<string>("")
  const [destination, setDestination] = useState<string>("download")
  const [connectionString, setConnectionString] = useState("")
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [fileName, setFileName] = useState("export_data")
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [compress, setCompress] = useState(false)
  const [customQuery, setCustomQuery] = useState("")
  const { toast } = useToast()

  const handleExport = () => {
    if (!exportType) {
      toast({
        title: "Error",
        description: "Please select an export format",
        variant: "destructive",
      })
      return
    }

    if (destination === "database" && !connectionString) {
      toast({
        title: "Error",
        description: "Please provide a database connection string",
        variant: "destructive",
      })
      return
    }

    if (destination === "api" && !apiEndpoint) {
      toast({
        title: "Error",
        description: "Please provide an API endpoint",
        variant: "destructive",
      })
      return
    }

    // Simulate export process
    toast({
      title: "Export Started",
      description: `Preparing ${exportType} export to ${destination}...`,
    })

    setTimeout(() => {
      if (destination === "download") {
        // Create and download file
        const data = generateSampleData()
        const blob = new Blob([data], { type: getContentType(exportType) })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName}.${getFileExtension(exportType)}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      toast({
        title: "Export Complete",
        description: `Data exported successfully as ${exportType} to ${destination}`,
      })
    }, 2000)
  }

  const generateSampleData = () => {
    const sampleData = [
      { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "active" }
    ]

    switch (exportType) {
      case "csv":
        const headers = includeHeaders ? "id,name,email,status\n" : ""
        return headers + sampleData.map(row => `${row.id},${row.name},${row.email},${row.status}`).join("\n")
      case "json":
        return JSON.stringify(sampleData, null, 2)
      case "sql":
        return sampleData.map(row => 
          `INSERT INTO users (id, name, email, status) VALUES (${row.id}, '${row.name}', '${row.email}', '${row.status}');`
        ).join("\n")
      default:
        return JSON.stringify(sampleData, null, 2)
    }
  }

  const getContentType = (type: string) => {
    switch (type) {
      case "csv": return "text/csv"
      case "json": return "application/json"
      case "sql": return "text/plain"
      case "excel": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      default: return "text/plain"
    }
  }

  const getFileExtension = (type: string) => {
    switch (type) {
      case "csv": return "csv"
      case "json": return "json"
      case "sql": return "sql"
      case "excel": return "xlsx"
      default: return "txt"
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
            <Download className="h-5 w-5" />
            Export Data
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="export-type">Export Format</Label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV File
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Excel (XLSX)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    JSON
                  </div>
                </SelectItem>
                <SelectItem value="sql">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    SQL Dump
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="destination">Export Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="download">Download to Device</SelectItem>
                <SelectItem value="database">Database Connection</SelectItem>
                <SelectItem value="api">API Endpoint</SelectItem>
                <SelectItem value="cloud">Cloud Storage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {destination === "download" && (
            <div>
              <Label htmlFor="filename">File Name</Label>
              <Input 
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="export_data"
              />
            </div>
          )}

          {destination === "database" && (
            <div>
              <Label htmlFor="connection">Database Connection String</Label>
              <Input 
                id="connection"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                placeholder="mongodb://localhost:27017/mydb or postgresql://user:pass@host:5432/db"
              />
            </div>
          )}

          {destination === "api" && (
            <div>
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input 
                id="api-endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.example.com/data"
              />
            </div>
          )}

          <div>
            <Label htmlFor="custom-query">Custom Query (Optional)</Label>
            <Textarea 
              id="custom-query"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="SELECT * FROM users WHERE status = 'active'"
              className="min-h-20"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="headers" 
                checked={includeHeaders}
                onCheckedChange={(checked) => setIncludeHeaders(checked === true)}
              />
              <Label htmlFor="headers">Include column headers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="compress" 
                checked={compress}
                onCheckedChange={(checked) => setCompress(checked === true)}
              />
              <Label htmlFor="compress">Compress output (ZIP)</Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleExport} className="flex-1">
              Export Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
