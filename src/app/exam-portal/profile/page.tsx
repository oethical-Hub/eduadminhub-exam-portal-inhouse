"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, institutionName } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Profile</h1>
        <p className="dashboard-subtitle">View your profile information</p>
      </div>

      <Card className="card-container">
        <CardHeader>
          <div className="flex-start gap-2">
            <UserIcon className="h-5 w-5" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>Profile page - Coming soon</CardDescription>
        </CardHeader>
        <CardContent className="section-container">
          {user && (
            <>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="text-base capitalize">{user.role}</p>
              </div>
              {institutionName && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Institution</p>
                  <p className="text-base">{institutionName}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

