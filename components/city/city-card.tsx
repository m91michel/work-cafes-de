import { City } from '@/libs/types';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

import { DefaultCafeImage } from '../cafe/Image';

type Props = {
  city: City;
}

export function CityCard({ city }: Props) {
    return (
      <Link href={`/city/${city.slug}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48">
            {city.preview_image && (
              <Image
                src={`${city.preview_image}?width=300`}
                alt={city.name || 'Preview Image of the City'}
                fill
                unoptimized
                className="object-cover"
              />
            )}
            {!city.preview_image && <DefaultCafeImage />}
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{city.name}</h3>
            <div className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> <p>{city.country}</p></div>
          </div>
        </Card>
      </Link>
    );
  }