"use client";

import { Coffee } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Coffee className="h-6 w-6" />
          <span className="font-semibold text-lg">Cafés zum Arbeiten</span>
        </Link>
        
        <nav>
          <Button asChild variant="default">
            <Link href="/contribute">
              Beitragen
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}