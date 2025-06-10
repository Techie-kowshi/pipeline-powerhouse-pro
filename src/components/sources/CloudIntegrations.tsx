
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cloud, Zap, Check, AlertCircle, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CloudProvider {
  id: string
  name: string
  logo: string
  status: 'connected' | 'disconnected' | 'configuring'
  description: string
  features: string[]
  connectedSince?: string
  lastSync?: string
}

export function CloudIntegrations() {
  const [providers, setProviders] = useState<CloudProvider[]>([
    {
      id: 'aws',
      name: 'Amazon Web Services',
      logo: '🟠',
      status: 'connected',
      description: 'Connect to AWS services like RDS, S3, CloudWatch, and Lambda',
      features: ['RDS Database', 'S3 Storage', 'CloudWatch Logs', 'Lambda Functions'],
      connectedSince: '2024-01-15',
      lastSync: '2 minutes ago'
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      logo: '🟡',
      status: 'connected',
      description: 'Integrate with BigQuery, Cloud Storage, and Analytics',
      features: ['BigQuery', 'Cloud Storage', 'Analytics', 'Pub/Sub'],
      connectedSince: '2024-01-20',
      lastSync: '5 minutes ago'
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      logo: '🔵',
      status: 'disconnected',
      description: 'Connect to Azure SQL, Blob Storage, and Application Insights',
      features: ['Azure SQL', 'Blob Storage', 'App Insights', 'Service Bus']
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      logo: '☁️',
      status: 'connected',
      description: 'Sync CRM data, leads, opportunities, and custom objects',
      features: ['CRM Data', 'Custom Objects', 'Reports', 'Dashboards'],
      connectedSince: '2024-02-01',
      lastSync: '10 minutes ago'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logo: '💳',
      status: 'configuring',
      description: 'Payment data, transactions, customers, and subscriptions',
      features: ['Payments', 'Subscriptions', 'Customers', 'Analytics']
    },
    {
      id: 'snowflake',
      name: 'Snowflake',
      logo: '❄️',
      status: 'disconnected',
      description: 'Cloud data warehouse for analytics and data science',
      features: ['Data Warehouse', 'Analytics', 'Data Sharing', 'ML Models']
    }
  ])

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const { toast } = useToast()

  const handleConnect = async (providerId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, status: 'configuring' } : p
    ))

    // Simulate connection process
    setTimeout(() => {
      setProviders(prev => prev.map(p => 
        p.id === providerId ? { 
          ...p, 
          status: 'connected',
          connectedSince: new Date().toISOString().split('T')[0],
          lastSync: 'Just now'
        } : p
      ))
      
      toast({
        title: "Integration Connected",
        description: `Successfully connected to ${providers.find(p => p.id === providerId)?.name}`
      })
      
      setSelectedProvider(null)
      setApiKey('')
    }, 2000)
  }

  const handleDisconnect = (providerId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { 
        ...p, 
        status: 'disconnected',
        connectedSince: undefined,
        lastSync: undefined
      } : p
    ))
    
    toast({
      title: "Integration Disconnected",
      description: `Disconnected from ${providers.find(p => p.id === providerId)?.name}`
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Check className="h-4 w-4 text-green-500" />
      case 'configuring': return <Settings className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'disconnected': return <AlertCircle className="h-4 w-4 text-gray-400" />
      default: return null
    }
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Cloud Integrations
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((provider) => (
            <div key={provider.id} className="p-4 border rounded-lg bg-background/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.logo}</span>
                  <div>
                    <div className="font-medium text-sm">{provider.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(provider.status)}
                      <Badge variant={
                        provider.status === 'connected' ? 'default' : 
                        provider.status === 'configuring' ? 'secondary' : 'outline'
                      } className="text-xs">
                        {provider.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {provider.status === 'connected' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDisconnect(provider.id)}
                  >
                    Disconnect
                  </Button>
                )}
                
                {provider.status === 'disconnected' && (
                  <Button 
                    size="sm"
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    Connect
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {provider.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {provider.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              
              {provider.status === 'connected' && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Connected: {provider.connectedSince}</div>
                  <div>Last sync: {provider.lastSync}</div>
                </div>
              )}
              
              {selectedProvider === provider.id && (
                <div className="mt-3 p-3 border rounded bg-muted/50 space-y-3">
                  <div>
                    <Label htmlFor="api-key" className="text-xs">API Key / Connection String</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleConnect(provider.id)}
                      disabled={!apiKey}
                    >
                      Connect
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedProvider(null)
                        setApiKey('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
