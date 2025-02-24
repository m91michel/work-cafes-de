import { CafeCard } from "@/components/cafe/cafe-card";
import { Cafe } from "@/libs/types";
import { cn } from "@/libs/utils";
import Link from "next/link";
import { Button } from "../../ui/button";
import Paths from "@/libs/paths";
import { ArrowRight } from "lucide-react";

interface Props {
  title?: string;
  subtitle?: string;
  cafes: Cafe[];
  className?: string;
  showMoreLink?: boolean;
  buttonText?: string;
}

export function SimpleCafeList({
  title,
  subtitle,
  cafes,
  className,
  showMoreLink,
  buttonText,
}: Props) {
  return (
    <section className={cn("max-w-7xl mx-auto px-4 py-12", className)}>
      <div className="flex flex-col md:flex-row justify-between items-top mb-6">
        <div className="flex flex-col gap-4">
          {title && <h2 className="text-2xl font-semibold">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        {showMoreLink && (
          <div className="flex justify-end mt-4 md:mt-0">
            <Link
              href={Paths.cafes}
              className="flex items-center gap-2 text-primary"
            >
              {buttonText || "Mehr Cafés anzeigen"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe) => (
          <CafeCard key={cafe.slug} cafe={cafe} />
        ))}
      </div>
    </section>
  );
}
