import { Card } from '@/components/ui/card';
import { Wifi, Power, Volume2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Cafe } from '@/lib/types';
import { generateSlug } from '@/lib/cafe-utils';

interface CafeCardProps {
  cafe: Cafe;
}

export function CafeCard({ cafe }: CafeCardProps) {
  const slug = generateSlug(cafe.city, cafe.name);

  return (
    <Link href={`/cafe/${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={cafe.image_url}
            alt={cafe.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{cafe.name}</h3>
          <p className="text-muted-foreground mb-4">{cafe.address}</p>
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              <span>{cafe.wifi_speed}</span>
            </div>
            <div className="flex items-center gap-1">
              <Power className="h-4 w-4" />
              <span>{cafe.power_outlets}</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="h-4 w-4" />
              <span>{cafe.noise_level}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}