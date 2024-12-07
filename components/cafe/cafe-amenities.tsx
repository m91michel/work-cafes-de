import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wifi, Power, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { Cafe } from '@/lib/types';

interface CafeAmenitiesProps {
  cafe: Cafe;
}

export function CafeAmenities({ cafe }: CafeAmenitiesProps) {
  return (
    <>
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Amenities</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">WiFi Speed</h3>
              <p className="text-muted-foreground">{cafe.wifi_speed}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Power className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Power Outlets</h3>
              <p className="text-muted-foreground">{cafe.power_outlets}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Noise Level</h3>
              <p className="text-muted-foreground">{cafe.noise_level}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <Button asChild variant="outline" className="w-full">
          <Link href="/">
            Back to All Cafes
          </Link>
        </Button>
      </div>
    </>
  );
}