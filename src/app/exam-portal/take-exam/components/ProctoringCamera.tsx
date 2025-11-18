"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Camera, CameraOff } from "lucide-react";
import { UseProctoringReturn } from "@/hooks/useProctoring";

// Dynamically import Webcam to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Webcam = dynamic<any>(
  () => import("react-webcam"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-60 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading camera...</p>
      </div>
    ),
  }
);

interface ProctoringCameraProps {
  proctoring: UseProctoringReturn;
  examId: string;
}

export default function ProctoringCamera({ proctoring, examId }: ProctoringCameraProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Request camera permission
  useEffect(() => {
    const requestCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        setError(null);
        // Stop the stream immediately, Webcam component will handle it
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        setHasPermission(false);
        setError(err.message || "Failed to access camera");
      }
    };

    requestCamera();
  }, []);

  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: "user",
  };

  const getStatusBadge = () => {
    if (!hasPermission) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <CameraOff className="h-3 w-3" />
          Camera Disabled
        </Badge>
      );
    }
    if (proctoring.faceDetected) {
      return (
        <Badge variant="default" className="bg-green-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Face Detected
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        No Face Detected
      </Badge>
    );
  };

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 w-64 z-50 cursor-pointer" onClick={() => setIsMinimized(false)}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="text-sm font-medium">Proctoring Active</span>
            </div>
            {getStatusBadge()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <CardTitle className="text-base">Proctoring Camera</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <button
              onClick={() => setIsMinimized(true)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Minimize
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasPermission ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
            <CameraOff className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center mb-2">
              Camera access is required for proctoring
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              onClick={async () => {
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                  setHasPermission(true);
                  setError(null);
                  stream.getTracks().forEach((track) => track.stop());
                } catch (err: any) {
                  setError(err.message || "Failed to access camera");
                }
              }}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Request Camera Access
            </button>
          </div>
        ) : (
          <div className="relative">
            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full rounded-lg"
            />
            {!proctoring.faceDetected && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="text-center text-white">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Face not detected</p>
                </div>
              </div>
            )}
          </div>
        )}
        {proctoring.lastDetection && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Last detection: {new Date(proctoring.lastDetection).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

