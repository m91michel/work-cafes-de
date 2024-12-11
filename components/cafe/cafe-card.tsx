import { Card } from '@/components/ui/card';
import { Wifi, Power, Volume2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Cafe } from '@/libs/types';
import { DefaultCafeImage } from './Image';


interface CafeCardProps {
  cafe: Cafe;
}

export function CafeCard({ cafe }: CafeCardProps) {

  return (
    <Link href={`/cafe/${cafe.slug}`}>
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
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              <span>{cafe.wifi_qualitity}</span>
            </div>
            <div className="flex items-center gap-1">
              <Power className="h-4 w-4" />
              <span>{cafe.seating_comfort}</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="h-4 w-4" />
              <span>{cafe.ambiance}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}