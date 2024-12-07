import { Coffee, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            <span className="font-semibold">WorkCafes.de</span>
          </div>
          
          <nav className="flex gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/contribute" className="text-muted-foreground hover:text-foreground transition-colors">
              Contribute
            </Link>
          </nav>
          
          <div className="flex gap-4">
            <a href="https://twitter.com/workcafes" target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://github.com/workcafes" target="_blank" rel="noopener noreferrer"
               className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WorkCafes.de. All rights reserved.
        </div>
      </div>
    </footer>
  );
}