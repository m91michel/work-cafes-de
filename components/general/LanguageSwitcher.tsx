"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isGerman } from "@/libs/environment";
import { alternateDomainName, domainName } from "@/config/config";

export function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <Link
      href={`https://${alternateDomainName}${pathname}?ref=${domainName}`}
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      {isGerman ? "🇺🇸 English" : "🇩🇪 Deutsch"}
    </Link>
  );
} 