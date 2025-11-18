"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <div className="text-center space-y-1 mt-8">
      <p className="text-sm text-muted-foreground">
        Copyright © 2025 - eduAdminHub
      </p>
      <p className="text-sm text-muted-foreground">
        School Management Platform by Oethical Technology
      </p>
      <div className="flex items-center justify-center gap-2 text-sm">
        <Link
          href="https://www.eduadminhub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Website
        </Link>
        <span className="text-muted-foreground">|</span>
        <Link
          href="mailto:support@eduadminhub.com"
          className="text-primary hover:underline"
        >
          support@eduadminhub.com
        </Link>
      </div>
    </div>
  );
}

