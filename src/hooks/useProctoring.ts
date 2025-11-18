import { useState, useEffect, useRef, useCallback } from "react";
import { ProctoringAlert, ProctoringStatus, AlertType, AlertSeverity } from "@/types/proctoring";

export interface UseProctoringReturn {
  isDetecting: boolean;
  alerts: ProctoringAlert[];
  status: ProctoringStatus;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  faceDetected: boolean;
  lastDetection: Date | null;
}

export const useProctoring = (examId: string, enabled: boolean = true): UseProctoringReturn => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [alerts, setAlerts] = useState<ProctoringAlert[]>([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [lastDetection, setLastDetection] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(false);

  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tabSwitchCountRef = useRef(0);
  const lastTabSwitchRef = useRef<Date | null>(null);

  // Simulate face detection (in real app, this would use ML/AI)
  const simulateFaceDetection = useCallback(() => {
    // Simulate face detection with 90% success rate
    const detected = Math.random() > 0.1;
    setFaceDetected(detected);
    
    if (detected) {
      setLastDetection(new Date());
    } else if (isDetecting) {
      // Face not detected - create alert
      addAlert("face-detection", "medium", "Face not detected. Please ensure you are visible in the camera.");
    }
  }, [isDetecting]);

  // Add alert
  const addAlert = useCallback((type: AlertType, severity: AlertSeverity, message: string) => {
    const newAlert: ProctoringAlert = {
      id: `alert-${Date.now()}-${Math.random()}`,
      type,
      timestamp: new Date().toISOString(),
      severity,
      message,
    };
    setAlerts((prev) => [...prev, newAlert]);
  }, []);

  // Monitor tab switching
  useEffect(() => {
    if (!enabled || !isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCountRef.current += 1;
        lastTabSwitchRef.current = new Date();
        addAlert("tab-switch", "high", "Tab switch detected. Please stay on the exam page.");
      }
    };

    const handleBlur = () => {
      addAlert("tab-switch", "high", "Window lost focus. Please return to the exam.");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled, isActive, addAlert]);

  // Monitor screen sharing (detect if user is sharing screen)
  useEffect(() => {
    if (!enabled || !isActive) return;

    // Check if screen is being shared by monitoring getDisplayMedia
    // Note: We can't directly detect if screen is shared, but we can monitor for attempts
    // In a real implementation, this would use a backend service to detect screen sharing
    
    const handleScreenShareAttempt = () => {
      // This would be called if we detect screen sharing through other means
      // For now, we'll monitor tab visibility and window focus
    };

    // Monitor for multiple tabs/windows (indirect screen share detection)
    // In real app, this would be handled by backend monitoring
    return () => {
      // Cleanup
    };
  }, [enabled, isActive, addAlert]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (!enabled) return;

    setIsActive(true);
    setIsDetecting(true);
    setAlerts([]);
    tabSwitchCountRef.current = 0;

    // Simulate face detection every 2 seconds
    detectionIntervalRef.current = setInterval(() => {
      simulateFaceDetection();
    }, 2000);

    // Initial detection
    simulateFaceDetection();
  }, [enabled, simulateFaceDetection]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsActive(false);
    setIsDetecting(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, []);

  // Auto-start when enabled
  useEffect(() => {
    if (enabled) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [enabled, startMonitoring, stopMonitoring]);

  const status: ProctoringStatus = {
    isActive,
    isDetecting,
    alerts,
    faceDetected,
    lastDetection: lastDetection?.toISOString() || null,
  };

  return {
    isDetecting,
    alerts,
    status,
    startMonitoring,
    stopMonitoring,
    faceDetected,
    lastDetection,
  };
};

