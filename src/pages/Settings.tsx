
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Database, Mail, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john@company.com",
    timezone: "UTC",
    emailNotifications: true,
    slackNotifications: false,
    darkMode: true,
    autoBackup: true,
    retentionDays: "30"
  })
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your profile information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({...prev, email: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({...prev, timezone: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about pipeline events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive pipeline alerts via email</p>
                </div>
                <Switch 
                  id="email-notif"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({...prev, emailNotifications: checked}))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="slack-notif">Slack Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts to Slack channels</p>
                </div>
                <Switch 
                  id="slack-notif"
                  checked={settings.slackNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({...prev, slackNotifications: checked}))}
                />
              </div>
              <Button onClick={handleSave}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <Separator />
              <div>
                <Label>API Keys</Label>
                <p className="text-sm text-muted-foreground">Manage your API access keys</p>
                <Button variant="outline" className="mt-2">Manage API Keys</Button>
              </div>
              <Separator />
              <div>
                <Label>Active Sessions</Label>
                <p className="text-sm text-muted-foreground">View and manage your active sessions</p>
                <Button variant="outline" className="mt-2">View Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Configure data retention and backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup your pipelines</p>
                </div>
                <Switch 
                  id="auto-backup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings(prev => ({...prev, autoBackup: checked}))}
                />
              </div>
              <div>
                <Label htmlFor="retention">Data Retention (days)</Label>
                <Input 
                  id="retention"
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings(prev => ({...prev, retentionDays: e.target.value}))}
                />
              </div>
              <Button onClick={handleSave}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                </div>
                <Switch 
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings(prev => ({...prev, darkMode: checked}))}
                />
              </div>
              <div>
                <Label>Theme Color</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred accent color</p>
                <div className="flex gap-2 mt-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer"></div>
                </div>
              </div>
              <Button onClick={handleSave}>Save Appearance</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
