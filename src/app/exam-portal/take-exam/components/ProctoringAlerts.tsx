"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, X } from "lucide-react";
import { ProctoringAlert } from "@/types/proctoring";
import { formatDateTime } from "@/utils/formatDate";

interface ProctoringAlertsProps {
  alerts: ProctoringAlert[];
  onDismiss?: (alertId: string) => void;
}

export default function ProctoringAlerts({ alerts, onDismiss }: ProctoringAlertsProps) {
  if (alerts.length === 0) return null;

  const getSeverityColor = (severity: ProctoringAlert["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800";
      case "low":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getAlertTypeLabel = (type: ProctoringAlert["type"]) => {
    switch (type) {
      case "face-detection":
        return "Face Detection";
      case "tab-switch":
        return "Tab Switch";
      case "screen-share":
        return "Screen Share";
      case "multiple-faces":
        return "Multiple Faces";
      default:
        return type;
    }
  };

  // Show only recent alerts (last 5)
  const recentAlerts = alerts.slice(-5).reverse();

  return (
    <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
              Proctoring Alerts ({alerts.length})
            </h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getAlertTypeLabel(alert.type)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          alert.severity === "high"
                            ? "border-red-300 text-red-700"
                            : alert.severity === "medium"
                            ? "border-yellow-300 text-yellow-700"
                            : "border-blue-300 text-blue-700"
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {formatDateTime(alert.timestamp)}
                    </p>
                  </div>
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

