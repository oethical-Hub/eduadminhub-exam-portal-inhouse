"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronDown, LogOut, Settings, User, Building2, LayoutDashboard, ClipboardList, FileQuestion, BarChart3, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserInitial } from "@/utils/getUserInitial";

export default function Header() {
  // All hooks must be called before any conditional returns
  const { user, institutionName, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Don't show header on login page or home page
  if (!isAuthenticated || pathname === "/login" || pathname === "/") {
    return null;
  }

  const userDisplayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.username || user?.email?.split("@")[0] || "User";
  
  const userRole = user?.role || "User";
  const userEmail = user?.email || "";
  const userInitial = getUserInitial(userDisplayName, userEmail);

  const handleLogout = async () => {
    await logout();
  };

  // Handle hover with delay to prevent flickering
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 200);
  };

  // Handle click and programmatic changes
  const handleOpenChange = (open: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setUserMenuOpen(open);
  };

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/exam-portal" className="text-xl font-bold">
              Exam Portal
            </Link>
            
            {/* Institution Name */}
            {institutionName && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{institutionName}</span>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/exam-portal/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/exam-portal/exams">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Exams
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/exam-portal/question-bank">
                  <FileQuestion className="h-4 w-4 mr-2" />
                  Question Bank
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/exam-portal/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </Button>
            </nav>
          </div>

          {/* Right: Theme Toggle and User Dropdown */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* User Dropdown */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              ref={containerRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenu open={userMenuOpen} onOpenChange={handleOpenChange} modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity outline-none"
                    aria-label="User menu"
                  >
                    {/* Avatar */}
                    <Avatar className="w-9 h-9 border-2 border-border">
                      <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name + Role */}
                    <div className="hidden md:flex flex-col items-start leading-tight">
                      <span className="text-sm font-medium text-foreground">
                        {userDisplayName}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {userRole}
                      </span>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </DropdownMenuTrigger>

                {/* Dropdown Content */}
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-2 py-1.5">
                    <div className="text-sm font-medium">{userDisplayName}</div>
                    <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
                    {institutionName && (
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {institutionName}
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/exam-portal/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/exam-portal/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

