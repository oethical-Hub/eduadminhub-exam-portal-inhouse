"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentProps<"input"> {
  showLockIcon?: boolean;
}

export default function PasswordInput({
  className,
  showLockIcon = true,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {showLockIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <Input
        type={showPassword ? "text" : "password"}
        className={cn(showLockIcon && "pl-10 pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

