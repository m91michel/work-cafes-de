import { Card } from '@/components/ui/card';
import { Wifi, Power, Volume2, Armchair } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Cafe } from '@/libs/types';
import { DefaultCafeImage } from './Image';
import { AmbianceBadge, SeatingComfortBadge, WifiQualitityBadge } from './cafe-badges';


interface CafeCardProps {
  cafe: Cafe;
}

export function CafeCard({ cafe }: CafeCardProps) {

  return (
    <Link href={`/cafes/${cafe.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          {cafe.preview_image && (
            <Image
              src={cafe.preview_image}
              alt={cafe.name || 'Preview Image of the Cafe'}
              fill
              unoptimized
              className="object-cover"
            />
          )}
          {!cafe.preview_image && <DefaultCafeImage />}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{cafe.name}</h3>
          <p className="text-muted-foreground mb-4">{cafe.address}</p>
          
          <div className="flex gap-2 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <WifiQualitityBadge value={cafe.wifi_qualitity} icon={<Wifi className="h-4 w-4 mr-1" />} />
            </div>
            <div className="flex items-center gap-1">
              <SeatingComfortBadge value={cafe.seating_comfort} icon={<Armchair className="h-4 w-4 mr-1" />} />
            </div>
            <div className="flex items-center gap-1">
              <AmbianceBadge value={cafe.ambiance} icon={<Volume2 className="h-4 w-4 mr-1" />} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}