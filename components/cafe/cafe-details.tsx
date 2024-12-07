import { Card } from '@/components/ui/card';
import { Clock, Globe, MapPin } from 'lucide-react';
import { Cafe } from '@/lib/types';

interface CafeDetailsProps {
  cafe: Cafe;
}

export function CafeDetails({ cafe }: CafeDetailsProps) {
  const openingHours = cafe.opening_hours.split('|').map(hours => (
    <div key={hours} className="text-sm">{hours}</div>
  ));

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">About this Cafe</h2>
      
      <div className="grid gap-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
          <div>
            <h3 className="font-medium">Address</h3>
            <p className="text-muted-foreground">{cafe.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground mt-1" />
          <div>
            <h3 className="font-medium">Opening Hours</h3>
            <div className="text-muted-foreground">
              {openingHours}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-muted-foreground mt-1" />
          <div>
            <h3 className="font-medium">Website</h3>
            <a 
              href={cafe.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {cafe.website}
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}