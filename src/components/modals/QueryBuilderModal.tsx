
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Terminal, Play, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QueryBuilderModalProps {
  trigger: React.ReactNode
}

export function QueryBuilderModal({ trigger }: QueryBuilderModalProps) {
  const [query, setQuery] = useState("SELECT * FROM customers WHERE created_at > '2024-01-01'")
  const [database, setDatabase] = useState("")
  const [results, setResults] = useState<any[]>([])
  const { toast } = useToast()

  const handleRunQuery = () => {
    if (!database) {
      toast({
        title: "Error",
        description: "Please select a database",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Query Executing",
      description: "Running your query...",
    })

    // Simulate query execution
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: "John Doe", email: "john@example.com", created_at: "2024-01-15" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", created_at: "2024-02-20" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", created_at: "2024-03-10" }
      ]
      setResults(mockResults)
      toast({
        title: "Query Complete",
        description: `Query executed successfully. ${mockResults.length} rows returned.`,
      })
    }, 1500)
  }

  const handleSaveQuery = () => {
    toast({
      title: "Query Saved",
      description: "Query has been saved to your library",
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Query Builder
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Select value={database} onValueChange={setDatabase}>
              <SelectTrigger>
                <SelectValue placeholder="Select database" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customers">Customer Database</SelectItem>
                <SelectItem value="analytics">Analytics DB</SelectItem>
                <SelectItem value="warehouse">Data Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea
              placeholder="Enter your SQL query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-32 font-mono"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRunQuery} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Run Query
            </Button>
            <Button variant="outline" onClick={handleSaveQuery} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Query
            </Button>
          </div>

          {results.length > 0 && (
            <div className="border rounded-lg p-4 bg-card/50">
              <h4 className="font-semibold mb-2">Query Results</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="text-left p-2">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-b">
                        {Object.values(row).map((value, j) => (
                          <td key={j} className="p-2">{String(value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
