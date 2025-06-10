
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Download, Database, Cloud, FileText, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedExportModalProps {
  trigger: React.ReactNode
}

export function EnhancedExportModal({ trigger }: EnhancedExportModalProps) {
  const [exportType, setExportType] = useState<string>("")
  const [fileName, setFileName] = useState("data_export")
  const [format, setFormat] = useState("csv")
  const [connectionString, setConnectionString] = useState<string>("")
  const [query, setQuery] = useState<string>("SELECT * FROM table_name")
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const generateSampleData = () => {
    const sampleData = [
      { id: 1, name: "John Doe", email: "john@example.com", city: "New York" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", city: "Los Angeles" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", city: "Chicago" },
      { id: 4, name: "Alice Brown", email: "alice@example.com", city: "Houston" },
      { id: 5, name: "Charlie Wilson", email: "charlie@example.com", city: "Phoenix" }
    ]
    return sampleData
  }

  const downloadFile = (data: any, filename: string, format: string) => {
    let content = ""
    let mimeType = ""
    
    switch (format) {
      case "csv":
        const headers = Object.keys(data[0]).join(",")
        const rows = data.map((row: any) => Object.values(row).join(","))
        content = [headers, ...rows].join("\n")
        mimeType = "text/csv"
        filename += ".csv"
        break
        
      case "json":
        content = JSON.stringify(data, null, 2)
        mimeType = "application/json"
        filename += ".json"
        break
        
      case "xml":
        const xmlRows = data.map((row: any) => {
          const xmlFields = Object.entries(row)
            .map(([key, value]) => `    <${key}>${value}</${key}>`)
            .join("\n")
          return `  <record>\n${xmlFields}\n  </record>`
        }).join("\n")
        content = `<?xml version="1.0" encoding="UTF-8"?>\n<data>\n${xmlRows}\n</data>`
        mimeType = "application/xml"
        filename += ".xml"
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = async () => {
    if (!exportType) {
      toast({
        title: "Error",
        description: "Please select an export type",
        variant: "destructive",
      })
      return
    }

    if (exportType === "file" && !fileName) {
      toast({
        title: "Error",
        description: "Please enter a filename",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    
    try {
      toast({
        title: "Export Started",
        description: `Starting ${exportType} export...`,
      })

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))

      const sampleData = generateSampleData()
      
      if (exportType === "file") {
        // Download to user's device
        downloadFile(sampleData, fileName, format)
        
        toast({
          title: "Export Complete",
          description: `File ${fileName}.${format} has been downloaded to your device`
        })
      } else {
        // Simulate database/API export
        const recordCount = sampleData.length
        toast({
          title: "Export Complete",
          description: `Successfully exported ${recordCount} records to ${exportType}`
        })
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not complete export. Please check your settings.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
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
            <Label htmlFor="export-type">Export Destination</Label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select export destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Download to Device
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
                    <Globe className="h-4 w-4" />
                    API Endpoint
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

          {exportType === "file" && (
            <>
              <div>
                <Label htmlFor="filename">File Name</Label>
                <Input 
                  id="filename"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter filename (without extension)"
                />
              </div>
              <div>
                <Label htmlFor="format">File Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {(exportType === "database" || exportType === "api" || exportType === "cloud") && (
            <>
              <div>
                <Label htmlFor="connection">Connection String</Label>
                <Input 
                  id="connection"
                  placeholder={
                    exportType === "database" 
                      ? "postgresql://user:pass@host:port/database"
                      : exportType === "api"
                      ? "https://api.example.com/endpoint"
                      : "s3://bucket-name/path or gs://bucket/path"
                  }
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                />
              </div>
              {exportType === "database" && (
                <div>
                  <Label htmlFor="query">SQL Query</Label>
                  <Textarea
                    id="query"
                    placeholder="INSERT INTO table_name (columns) VALUES ..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleExport} 
              className="flex-1"
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Start Export"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
