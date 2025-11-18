import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Settings</h1>
        <p className="dashboard-subtitle">Manage your account settings</p>
      </div>

      <Card className="card-container">
        <CardHeader>
          <div className="flex-start gap-2">
            <SettingsIcon className="h-5 w-5" />
            <CardTitle>Settings</CardTitle>
          </div>
          <CardDescription>Settings page - Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Settings functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

