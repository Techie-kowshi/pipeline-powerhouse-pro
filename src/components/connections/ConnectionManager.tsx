
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Database, Globe, Cloud, Trash2, TestTube } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Connection {
  id: string
  name: string
  type: string
  connectionString: string
  status: 'connected' | 'disconnected' | 'testing'
  lastTested: string
}

export function ConnectionManager() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1',
      name: 'Production DB',
      type: 'mongodb',
      connectionString: 'mongodb://localhost:27017/production',
      status: 'connected',
      lastTested: '2 minutes ago'
    }
  ])
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'mongodb',
    connectionString: ''
  })
  const { toast } = useToast()

  const testConnection = async (connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId ? { ...conn, status: 'testing' as const } : conn
    ))

    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId ? { 
          ...conn, 
          status: success ? 'connected' : 'disconnected',
          lastTested: 'Just now'
        } : conn
      ))
      
      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success ? "Database connection established" : "Could not connect to database",
        variant: success ? "default" : "destructive"
      })
    }, 2000)
  }

  const addConnection = () => {
    if (!newConnection.name || !newConnection.connectionString) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    const connection: Connection = {
      id: Date.now().toString(),
      ...newConnection,
      status: 'disconnected',
      lastTested: 'Never'
    }

    setConnections(prev => [...prev, connection])
    setNewConnection({ name: '', type: 'mongodb', connectionString: '' })
    
    toast({
      title: "Connection Added",
      description: `${newConnection.name} has been added to your connections`
    })
  }

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id))
    toast({
      title: "Connection Deleted",
      description: "Connection has been removed"
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'mongodb': return Database
      case 'api': return Globe
      case 'cloud': return Cloud
      default: return Database
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="connections" className="w-full">
        <TabsList>
          <TabsTrigger value="connections">Manage Connections</TabsTrigger>
          <TabsTrigger value="add">Add New Connection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connections" className="space-y-4">
          {connections.map((connection) => {
            const Icon = getIcon(connection.type)
            return (
              <Card key={connection.id} className="bg-card/50 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-base">{connection.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{connection.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <Badge variant={connection.status === 'connected' ? 'default' : 'secondary'}>
                      {connection.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {connection.connectionString}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Last tested: {connection.lastTested}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => testConnection(connection.id)}
                      disabled={connection.status === 'testing'}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      {connection.status === 'testing' ? 'Testing...' : 'Test'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteConnection(connection.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
        
        <TabsContent value="add" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Add New Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="conn-name">Connection Name</Label>
                <Input
                  id="conn-name"
                  value={newConnection.name}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Database"
                />
              </div>
              <div>
                <Label htmlFor="conn-type">Connection Type</Label>
                <select 
                  className="w-full p-2 border rounded-md bg-background"
                  value={newConnection.type}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="mongodb">MongoDB</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="api">REST API</option>
                  <option value="cloud">Cloud Storage</option>
                </select>
              </div>
              <div>
                <Label htmlFor="conn-string">Connection String</Label>
                <Input
                  id="conn-string"
                  value={newConnection.connectionString}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, connectionString: e.target.value }))}
                  placeholder="mongodb://username:password@host:port/database"
                />
              </div>
              <Button onClick={addConnection} className="w-full">
                Add Connection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
