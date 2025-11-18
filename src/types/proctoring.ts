export type AlertType =
  | "face-detection"
  | "tab-switch"
  | "screen-share"
  | "multiple-faces";

export type AlertSeverity = "low" | "medium" | "high";

export interface ProctoringAlert {
  id: string;
  type: AlertType;
  timestamp: string; // ISO date string
  severity: AlertSeverity;
  message: string;
}

export interface ProctoringStatus {
  isActive: boolean;
  isDetecting: boolean;
  alerts: ProctoringAlert[];
  faceDetected: boolean;
  lastDetection: string | null; // ISO date string
}

