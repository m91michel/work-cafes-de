import Image from "next/image";
import { Cafe } from "@/libs/types";
import { DefaultCafeImage } from "./Image";

interface CafeHeroProps {
  cafe: Cafe;
}

export function CafeHero({ cafe }: CafeHeroProps) {
  return (
    <div className="relative h-[400px] max-w-7xl mx-auto px-4">
      <div className="relative h-full w-full rounded-b-xl overflow-hidden">
        <div className="relative h-full w-full px-4">
          {cafe.preview_image && (
            <Image
              src={cafe.preview_image}
              alt={cafe.name || ""}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          )}
          {!cafe.preview_image && <DefaultCafeImage />}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-2">{cafe.name}</h1>
            <p className="text-xl text-white/90">{cafe.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
