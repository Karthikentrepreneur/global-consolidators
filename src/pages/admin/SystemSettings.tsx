import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Plus, RefreshCw } from "lucide-react";

type PageSeoSetting = Database["public"]["Tables"]["page_seo_settings"]["Row"];

type SeoFormState = {
  pageKey: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterTitle: string;
  twitterDescription: string;
};

const createEmptySeoForm = (): SeoFormState => ({
  pageKey: "",
  pageName: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  twitterTitle: "",
  twitterDescription: "",
});

const formatUpdatedAt = (value: string) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const SystemSettings = () => {
  const { toast } = useToast();

  const [seoRecords, setSeoRecords] = useState<PageSeoSetting[]>([]);
  const [selectedSeoPageKey, setSelectedSeoPageKey] = useState<string | null>(null);
  const [isCreatingSeoPage, setIsCreatingSeoPage] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoSaving, setSeoSaving] = useState(false);
  const [seoForm, setSeoForm] = useState<SeoFormState>(() => createEmptySeoForm());

  const selectedSeoRecord = useMemo(() => {
    if (!selectedSeoPageKey) return null;
    return seoRecords.find((record) => record.page_key === selectedSeoPageKey) ?? null;
  }, [seoRecords, selectedSeoPageKey]);

  const loadFormFromRecord = useCallback((record: PageSeoSetting | null) => {
    if (!record) {
      setSeoForm(createEmptySeoForm());
      return;
    }

    setSeoForm({
      pageKey: record.page_key,
      pageName: record.page_name,
      metaTitle: record.meta_title ?? "",
      metaDescription: record.meta_description ?? "",
      metaKeywords: record.meta_keywords ?? "",
      canonicalUrl: record.canonical_url ?? "",
      ogTitle: record.og_title ?? "",
      ogDescription: record.og_description ?? "",
      ogImageUrl: record.og_image_url ?? "",
      twitterTitle: record.twitter_title ?? "",
      twitterDescription: record.twitter_description ?? "",
    });
  }, []);

  const fetchSeoPages = useCallback(
    async (preferredKey?: string) => {
      setSeoLoading(true);
      try {
        const { data, error } = await supabase
          .from("page_seo_settings")
          .select("*")
          .order("page_name", { ascending: true });

        if (error) throw error;

        const rows = (data as PageSeoSetting[]) ?? [];
        setSeoRecords(rows);

        if (rows.length === 0) {
          setIsCreatingSeoPage(true);
          setSelectedSeoPageKey(null);
          setSeoForm(createEmptySeoForm());
          return;
        }

        const targetKey = preferredKey ?? selectedSeoPageKey ?? rows[0].page_key;
        const nextRecord = rows.find((row) => row.page_key === targetKey) ?? rows[0];

        setIsCreatingSeoPage(false);
        setSelectedSeoPageKey((prev) => (prev === nextRecord.page_key ? prev : nextRecord.page_key));
        loadFormFromRecord(nextRecord);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast({
          variant: "destructive",
          title: "Unable to load SEO settings",
          description: message || "An unexpected error occurred while loading SEO settings.",
        });
      } finally {
        setSeoLoading(false);
      }
    },
    [loadFormFromRecord, selectedSeoPageKey, toast]
  );

  useEffect(() => {
    fetchSeoPages();
  }, [fetchSeoPages]);

  const handleSelectSeoPage = (pageKey: string) => {
    setSelectedSeoPageKey(pageKey);
    setIsCreatingSeoPage(false);

    const record = seoRecords.find((item) => item.page_key === pageKey) ?? null;
    loadFormFromRecord(record);
  };

  const handleCreateSeoPage = () => {
    setIsCreatingSeoPage(true);
    setSelectedSeoPageKey(null);
    setSeoForm(createEmptySeoForm());
  };

  const handleSeoInputChange = (field: keyof SeoFormState, value: string) => {
    setSeoForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSeoReset = () => {
    if (isCreatingSeoPage) {
      setSeoForm(createEmptySeoForm());
      return;
    }

    loadFormFromRecord(selectedSeoRecord);
  };

  const handleSeoCancelCreate = () => {
    if (seoRecords.length === 0) {
      setSeoForm(createEmptySeoForm());
      return;
    }

    const fallbackRecord = selectedSeoRecord ?? seoRecords[0];
    setIsCreatingSeoPage(false);
    setSelectedSeoPageKey(fallbackRecord.page_key);
    loadFormFromRecord(fallbackRecord);
  };

  const handleSeoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const pageKey = seoForm.pageKey.trim();
    const pageName = seoForm.pageName.trim();

    if (!pageKey || !pageName) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Page identifier and page name are required to save SEO settings.",
      });
      return;
    }

    setSeoSaving(true);
    try {
      const payload = {
        page_key: pageKey,
        page_name: pageName,
        meta_title: seoForm.metaTitle.trim() || null,
        meta_description: seoForm.metaDescription.trim() || null,
        meta_keywords: seoForm.metaKeywords.trim() || null,
        canonical_url: seoForm.canonicalUrl.trim() || null,
        og_title: seoForm.ogTitle.trim() || null,
        og_description: seoForm.ogDescription.trim() || null,
        og_image_url: seoForm.ogImageUrl.trim() || null,
        twitter_title: seoForm.twitterTitle.trim() || null,
        twitter_description: seoForm.twitterDescription.trim() || null,
        updated_at: new Date().toISOString(),
      } satisfies Database["public"]["Tables"]["page_seo_settings"]["Insert"];

      const { error } = await supabase
        .from("page_seo_settings")
        .upsert(payload, { onConflict: "page_key" });

      if (error) throw error;

      toast({
        title: "SEO settings saved",
        description: `SEO metadata for "${pageName}" has been saved successfully.`,
      });

      setIsCreatingSeoPage(false);
      setSelectedSeoPageKey(pageKey);
      await fetchSeoPages(pageKey);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast({
        variant: "destructive",
        title: "Unable to save SEO settings",
        description: message || "An unexpected error occurred while saving SEO settings.",
      });
    } finally {
      setSeoSaving(false);
    }
  };

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

        <TabsContent value="seo" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <CardTitle>Page SEO Overview</CardTitle>
                  <CardDescription>Review all page SEO entries and pick one to edit.</CardDescription>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button size="sm" variant="outline" onClick={() => fetchSeoPages(selectedSeoPageKey ?? undefined)} disabled={seoLoading}>
                    {seoLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Refresh
                  </Button>
                  <Button size="sm" onClick={handleCreateSeoPage} variant={isCreatingSeoPage ? "default" : "secondary"}>
                    <Plus className="mr-2 h-4 w-4" />
                    New page
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{seoRecords.length} pages</Badge>
                  {!isCreatingSeoPage && selectedSeoRecord && (
                    <span className="text-xs text-muted-foreground">
                      Editing {selectedSeoRecord.page_name}
                    </span>
                  )}
                </div>

                {seoLoading ? (
                  <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading page SEO…
                  </div>
                ) : seoRecords.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No SEO records yet. Create your first page entry to get started.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>Meta title</TableHead>
                        <TableHead>Last updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seoRecords.map((record) => (
                        <TableRow
                          key={record.id}
                          data-state={selectedSeoPageKey === record.page_key ? "selected" : undefined}
                          className="cursor-pointer"
                          onClick={() => handleSelectSeoPage(record.page_key)}
                        >
                          <TableCell>
                            <div className="font-medium">{record.page_name}</div>
                            <div className="text-xs text-muted-foreground">{record.page_key}</div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {record.meta_title ?? "—"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {formatUpdatedAt(record.updated_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleSelectSeoPage(record.page_key);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle>
                    {isCreatingSeoPage
                      ? "Create SEO entry"
                      : selectedSeoRecord?.page_name
                      ? `Edit ${selectedSeoRecord.page_name}`
                      : "Select a page to edit"}
                  </CardTitle>
                  <Badge variant="outline">{isCreatingSeoPage ? "New" : "Editing"}</Badge>
                </div>
                <CardDescription>
                  {isCreatingSeoPage
                    ? "Provide metadata for a new page so it can be discovered by search engines."
                    : selectedSeoRecord
                    ? `Update search and social metadata for "${selectedSeoRecord.page_name}".`
                    : "Pick a page on the left to review and update its SEO metadata."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSeoSave} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="seo-page-key">Page identifier *</Label>
                      <Input
                        id="seo-page-key"
                        value={seoForm.pageKey}
                        onChange={(event) => handleSeoInputChange("pageKey", event.target.value)}
                        placeholder="e.g., home"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Use lowercase letters, numbers, and dashes. This maps to the page slug.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="seo-page-name">Page name *</Label>
                      <Input
                        id="seo-page-name"
                        value={seoForm.pageName}
                        onChange={(event) => handleSeoInputChange("pageName", event.target.value)}
                        placeholder="Human-friendly page name"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="seo-meta-title">Meta title</Label>
                      <Input
                        id="seo-meta-title"
                        value={seoForm.metaTitle}
                        onChange={(event) => handleSeoInputChange("metaTitle", event.target.value)}
                        maxLength={70}
                        placeholder="Up to 70 characters"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">{seoForm.metaTitle.length}/70 characters</p>
                    </div>
                    <div>
                      <Label htmlFor="seo-meta-keywords">Meta keywords</Label>
                      <Input
                        id="seo-meta-keywords"
                        value={seoForm.metaKeywords}
                        onChange={(event) => handleSeoInputChange("metaKeywords", event.target.value)}
                        placeholder="keyword1, keyword2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="seo-meta-description">Meta description</Label>
                    <Textarea
                      id="seo-meta-description"
                      value={seoForm.metaDescription}
                      onChange={(event) => handleSeoInputChange("metaDescription", event.target.value)}
                      rows={3}
                      maxLength={160}
                      placeholder="Describe the page for search engines"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{seoForm.metaDescription.length}/160 characters</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="seo-canonical-url">Canonical URL</Label>
                      <Input
                        id="seo-canonical-url"
                        type="url"
                        value={seoForm.canonicalUrl}
                        onChange={(event) => handleSeoInputChange("canonicalUrl", event.target.value)}
                        placeholder="https://example.com/page"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seo-og-image">OG image URL</Label>
                      <Input
                        id="seo-og-image"
                        type="url"
                        value={seoForm.ogImageUrl}
                        onChange={(event) => handleSeoInputChange("ogImageUrl", event.target.value)}
                        placeholder="https://example.com/og-image.jpg"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="seo-og-title">Open Graph title</Label>
                      <Input
                        id="seo-og-title"
                        value={seoForm.ogTitle}
                        onChange={(event) => handleSeoInputChange("ogTitle", event.target.value)}
                        placeholder="Title for social sharing"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seo-og-description">Open Graph description</Label>
                      <Textarea
                        id="seo-og-description"
                        value={seoForm.ogDescription}
                        onChange={(event) => handleSeoInputChange("ogDescription", event.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="seo-twitter-title">Twitter title</Label>
                      <Input
                        id="seo-twitter-title"
                        value={seoForm.twitterTitle}
                        onChange={(event) => handleSeoInputChange("twitterTitle", event.target.value)}
                        placeholder="Title for Twitter cards"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seo-twitter-description">Twitter description</Label>
                      <Textarea
                        id="seo-twitter-description"
                        value={seoForm.twitterDescription}
                        onChange={(event) => handleSeoInputChange("twitterDescription", event.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    {isCreatingSeoPage && seoRecords.length > 0 && (
                      <Button type="button" variant="ghost" onClick={handleSeoCancelCreate} disabled={seoSaving}>
                        Cancel
                      </Button>
                    )}
                    <Button type="button" variant="outline" onClick={handleSeoReset} disabled={seoSaving}>
                      Reset
                    </Button>
                    <Button type="submit" disabled={seoSaving}>
                      {seoSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save SEO"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
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
