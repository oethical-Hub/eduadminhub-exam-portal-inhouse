"use client";

import { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentProps<"input"> {
  showLockIcon?: boolean;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showLockIcon = true, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        <div className="input-wrapper">
          {showLockIcon && (
            <Lock className="input-icon-left" />
          )}
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn(
              showLockIcon && "input-field-with-icon",
              error && "input-error",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-btn"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="password-toggle-icon" />
            ) : (
              <Eye className="password-toggle-icon" />
            )}
          </button>
        </div>
        {error && (
          <p className="form-error">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
