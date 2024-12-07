import Image from 'next/image';
import { Cafe } from '@/lib/types';

interface CafeHeroProps {
  cafe: Cafe;
}

export function CafeHero({ cafe }: CafeHeroProps) {
  return (
    <div className="relative h-[400px] w-full">
      <Image
        src={cafe.image_url}
        alt={cafe.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">{cafe.name}</h1>
          <p className="text-xl text-white/90">{cafe.city}</p>
        </div>
      </div>
    </div>
  );
}