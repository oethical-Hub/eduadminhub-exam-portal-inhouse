import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Analytics</h1>
        <p className="dashboard-subtitle">Performance insights and statistics</p>
      </div>

      <Card className="card-container">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Overall exam statistics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="empty-state">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
            <p>No analytics data available yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

