import { CafeCard } from "@/components/cafe/cafe-card";
import { Cafe } from "@/libs/types";
import { cn } from "@/libs/utils";
import Link from "next/link";
import { Button } from "../../ui/button";

interface Props {
  title?: string;
  subtitle?: string;
  cafes: Cafe[];
  className?: string;
  showMoreButton?: boolean;
  buttonText?: string;
}

export function SimpleCafeList({ title, subtitle, cafes, className, showMoreButton, buttonText }: Props) {
  return (
    <section className={cn("max-w-7xl mx-auto px-4 py-12", className)}>
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      {subtitle && <p className="text-muted-foreground mb-6">{subtitle}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe) => (
          <CafeCard key={cafe.slug} cafe={cafe} />
        ))}
      </div>
      {showMoreButton && (
        <div className="flex justify-center mt-6">
        <Button variant="default" asChild>
          <Link href="/cafes">
            {buttonText || "Mehr Cafés anzeigen"}
          </Link>
        </Button>
      </div>
      )}
    </section>
  );
}
