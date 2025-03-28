"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Paths from "@/libs/paths";
import { useCTranslation } from "@/hooks/use-translation";

const menuItems = [
  { href: Paths.home, key: "navigation.home" },
  { href: Paths.cafes, key: "navigation.cafes" },
  { href: Paths.cities, key: "navigation.cities" },
  { href: Paths.about, key: "navigation.about" }
];

type Props = {
  className?: string;
  onClick?: () => void;
};

export function NavLinks({ className, onClick }: Props) {
  const { t } = useCTranslation();

  return (
    <div className={className}>
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="py-2 block text-base font-medium text-muted-foreground hover:text-primary transition-colors"
          onClick={onClick}
        >
          {t(item.key)}
        </Link>
      ))}
      <Button asChild variant="default" className="mt-2 md:mt-0 md:ml-4">
        <Link href={Paths.contribute} onClick={onClick}>
          {t('navigation.contribute')}
        </Link>
      </Button>
    </div>
  );
}
