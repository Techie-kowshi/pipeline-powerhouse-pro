
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Database, Cloud } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportDataModalProps {
  trigger: React.ReactNode
}

export function ExportDataModal({ trigger }: ExportDataModalProps) {
  const [exportType, setExportType] = useState<string>("")
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [compress, setCompress] = useState(false)
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

    toast({
      title: "Export Started",
      description: `Preparing ${exportType} export. Download will begin shortly.`,
    })

    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Data exported successfully as ${exportType}`,
      })
    }, 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
