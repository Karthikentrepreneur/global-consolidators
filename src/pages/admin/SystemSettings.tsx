import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Basic system configuration and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="AURACARGO" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" defaultValue="support@auracargo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                      <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                      <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="system-announcement">System Announcement</Label>
                <Textarea 
                  id="system-announcement" 
                  placeholder="Enter a system-wide announcement message"
                  defaultValue="Scheduled maintenance on June 30th from 2AM to 4AM UTC. Some services may be unavailable during this time."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="show-announcement" defaultChecked />
                <Label htmlFor="show-announcement">Display announcement banner</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature Configuration</CardTitle>
              <CardDescription>Enable or disable system features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">User Registration</h4>
                  <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                </div>
                <Switch id="user-registration" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Shipment Tracking</h4>
                  <p className="text-sm text-muted-foreground">Enable shipment tracking features</p>
                </div>
                <Switch id="shipment-tracking" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Online Payments</h4>
                  <p className="text-sm text-muted-foreground">Allow users to make payments online</p>
                </div>
                <Switch id="online-payments" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Customer Reviews</h4>
                  <p className="text-sm text-muted-foreground">Enable customer review functionality</p>
                </div>
                <Switch id="customer-reviews" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-muted-foreground">Put the system in maintenance mode</p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Configure login and authentication options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Require 2FA for administrator accounts</p>
                </div>
                <Switch id="require-2fa" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Password Complexity</h4>
                  <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                </div>
                <Switch id="password-complexity" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-attempts">Maximum Login Attempts</Label>
                <Input id="login-attempts" type="number" defaultValue="5" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input id="password-expiry" type="number" defaultValue="90" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API access and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Enable API Access</h4>
                  <p className="text-sm text-muted-foreground">Allow external API integrations</p>
                </div>
                <Switch id="api-access" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" value="sk_live_7a8b9c0d1e2f3g4h5i6j7k8l" readOnly />
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
                <p className="text-xs text-muted-foreground">Last regenerated: 15 days ago</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-rate-limit">Rate Limit (requests per minute)</Label>
                <Input id="api-rate-limit" type="number" defaultValue="60" />
              </div>
              
              <div className="space-y-2">
                <Label>Allowed Origins</Label>
                <div className="flex gap-2 flex-wrap">
                  <Badge>https://auracargo.com</Badge>
                  <Badge>https://admin.auracargo.com</Badge>
                  <Badge>https://api.partner.com</Badge>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">+ Add Origin</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure system email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-sender">Sender Email</Label>
                <Input id="email-sender" defaultValue="notifications@auracargo.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-reply-to">Reply-To Email</Label>
                <Input id="email-reply-to" defaultValue="support@auracargo.com" />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">User Registration</h4>
                  <p className="text-sm text-muted-foreground">Send welcome emails to new users</p>
                </div>
                <Switch id="welcome-email" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Shipment Updates</h4>
                  <p className="text-sm text-muted-foreground">Send notifications for shipment status changes</p>
                </div>
                <Switch id="shipment-emails" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Payment Confirmations</h4>
                  <p className="text-sm text-muted-foreground">Send receipts for completed payments</p>
                </div>
                <Switch id="payment-emails" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">System Alerts</h4>
                  <p className="text-sm text-muted-foreground">Send notifications for system events</p>
                </div>
                <Switch id="system-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>Configure system SMS notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Enable SMS Notifications</h4>
                  <p className="text-sm text-muted-foreground">Send SMS alerts for important events</p>
                </div>
                <Switch id="enable-sms" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sms-provider">SMS Provider</Label>
                <Select defaultValue="twilio">
                  <SelectTrigger>
                    <SelectValue placeholder="Select SMS provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="nexmo">Nexmo</SelectItem>
                    <SelectItem value="aws">AWS SNS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Delivery Updates</h4>
                  <p className="text-sm text-muted-foreground">Send SMS for delivery status changes</p>
                </div>
                <Switch id="delivery-sms" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Security Alerts</h4>
                  <p className="text-sm text-muted-foreground">Send SMS for account security events</p>
                </div>
                <Switch id="security-sms" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure payment processing integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Stripe</h4>
                    <p className="text-sm text-muted-foreground">Credit card processing</p>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M16.5 4h5.5l-6 15h-4.5" />
                      <path d="M8 4h-5.5l6 15h4.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">PayPal</h4>
                    <p className="text-sm text-muted-foreground">Alternative payment method</p>
                  </div>
                </div>
                <Badge variant="outline">Configure</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M12 9v6" />
                      <path d="M9 9v6" />
                      <path d="M15 9v6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Bank Transfer</h4>
                    <p className="text-sm text-muted-foreground">Direct bank payments</p>
                  </div>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shipping Partners</CardTitle>
              <CardDescription>Configure shipping service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-amber-100 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <rect width="16" height="13" x="4" y="6" rx="2" />
                      <path d="m22 8-4 2v4l4 2" />
                      <path d="m4 8 4 2v4l-4 2" />
                      <path d="m12 8 4 2v4l-4 2" />
                      <path d="m12 8-4 2v4l4 2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">FedEx</h4>
                    <p className="text-sm text-muted-foreground">Express shipping service</p>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-amber-100 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <rect width="16" height="10" x="4" y="7" rx="1" />
                      <path d="M20 10h-5.5a2.5 2.5 0 0 0 0 5H20" />
                      <path d="M4 12h16" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">UPS</h4>
                    <p className="text-sm text-muted-foreground">Global shipping partner</p>
                  </div>
                </div>
                <Badge variant="outline">Configure</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-amber-100 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <path d="M12.5 3.3C8.3 3.3 3 6.1 3 13v5.5a2.5 2.5 0 0 0 2.5 2.5h13a2.5 2.5 0 0 0 2.5-2.5V13c0-6.9-5.3-9.7-9.5-9.7Z" />
                      <path d="M12.5 3.3V6" />
                      <path d="M3 8.5h18" />
                      <path d="M7 14h0" />
                      <path d="M7 17.5h0" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">DHL</h4>
                    <p className="text-sm text-muted-foreground">International shipping</p>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Selection</CardTitle>
              <CardDescription>Choose which page SEO settings you want to edit</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seo-page">Page</Label>
                <Select defaultValue="home">
                  <SelectTrigger id="seo-page">
                    <SelectValue placeholder="Select a page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="about">About Us</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-locale">Locale</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="seo-locale">
                    <SelectValue placeholder="Select locale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">Bangla</SelectItem>
                    <SelectItem value="si">Sinhala</SelectItem>
                    <SelectItem value="my">Burmese</SelectItem>
                    <SelectItem value="ur">Urdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meta Tags</CardTitle>
              <CardDescription>Update how this page appears in search engine results</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="seo-title">Meta Title</Label>
                <Input
                  id="seo-title"
                  placeholder="Enter a concise, keyword-rich title"
                  defaultValue="AuraCargo | Seamless Global Logistics Solutions"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="seo-description">Meta Description</Label>
                <Textarea
                  id="seo-description"
                  placeholder="Summarize the page content in 150-160 characters"
                  defaultValue="AuraCargo delivers end-to-end freight forwarding, customs clearance, and warehousing services across South Asia."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-keywords">Target Keywords</Label>
                <Input
                  id="seo-keywords"
                  placeholder="Enter comma-separated keywords"
                  defaultValue="global logistics, freight forwarding, AuraCargo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-slug">URL Slug</Label>
                <Input id="seo-slug" placeholder="Enter the page slug" defaultValue="global-logistics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-canonical">Canonical URL</Label>
                <Input id="seo-canonical" placeholder="https://auracargo.com/page" defaultValue="https://auracargo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-schema">Schema Type</Label>
                <Select defaultValue="corporation">
                  <SelectTrigger id="seo-schema">
                    <SelectValue placeholder="Select schema type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="faq">FAQ Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Sharing</CardTitle>
              <CardDescription>Control how the page looks when shared on social platforms</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="seo-og-title">Open Graph Title</Label>
                <Input
                  id="seo-og-title"
                  placeholder="Title shown when shared on social media"
                  defaultValue="AuraCargo – Logistics experts connecting South Asia to the world"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="seo-og-description">Open Graph Description</Label>
                <Textarea
                  id="seo-og-description"
                  placeholder="Description for social media cards"
                  defaultValue="Discover AuraCargo's tailored logistics network covering Bangladesh, Sri Lanka, Myanmar, and Pakistan."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-og-image">Social Share Image URL</Label>
                <Input
                  id="seo-og-image"
                  placeholder="https://auracargo.com/images/social-card.png"
                  defaultValue="https://auracargo.com/images/social-card.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-twitter-handle">Twitter Handle</Label>
                <Input id="seo-twitter-handle" placeholder="@auracargo" defaultValue="@auracargo" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button>Save SEO Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel Changes</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default SystemSettings;
