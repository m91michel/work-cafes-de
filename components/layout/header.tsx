"use client";

import { Coffee } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6" />
              <span className="font-semibold text-lg">Café zum Arbeiten</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Finde das perfekte Cafe wo du arbeiten kannst und darfst
            </span>
          </div>
        </Link>

        <nav className="flex gap-6 items-center justify-center">
          <Link href="/" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/ueber-uns" className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
            Über uns
          </Link>
          <Button asChild variant="default" className="ml-4">
            <Link href="/helfe-uns">Helfe uns</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
