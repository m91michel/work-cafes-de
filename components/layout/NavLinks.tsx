import Link from "next/link";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/", label: "Startseite" },
  { href: "/cafes", label: "Cafés" },
  { href: "/cities", label: "Städte" },
  { href: "/ueber-uns", label: "Über uns" }
];

type Props = {
  className?: string;
  onClick?: () => void;
};

export function NavLinks({ className, onClick }: Props) {
  return (
    <div className={className}>
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="py-2 block text-base font-medium text-muted-foreground hover:text-primary transition-colors"
          onClick={onClick}
        >
          {item.label}
        </Link>
      ))}
      <Button asChild variant="default" className="mt-2 md:mt-0 md:ml-4">
        <Link href="/helfe-uns" onClick={onClick}>
          Helfe uns
        </Link>
      </Button>
    </div>
  );
}
