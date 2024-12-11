import Link from "next/link";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/ueber-uns", label: "Über uns" }
];

export function NavLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="py-2 block text-base font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          {item.label}
        </Link>
      ))}
      <Button asChild variant="default" className="mt-2 md:mt-0 md:ml-4">
        <Link href="/helfe-uns">Helfe uns</Link>
      </Button>
    </div>
  );
}
