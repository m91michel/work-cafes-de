import { Card } from "@/components/ui/card";
import { Clock, LinkIcon, MapPin } from "lucide-react";
import { Cafe } from "@/libs/types";
import { CafeLinks } from "./links";

interface CafeDetailsProps {
  cafe: Cafe;
}

export function CafeDetails({ cafe }: CafeDetailsProps) {
  const openingHours = cafe.open_hours?.split("\n").map((hours) => (
    <div key={hours} className="text-sm">
      {hours}
    </div>
  ));

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Über dieses Cafe</h2>

      <div className="grid gap-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-1" />

          <div>
            <h3 className="font-medium">Adresse</h3>
            <p className="text-muted-foreground">{cafe.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-5">
            <Clock className="h-5 w-5 text-muted-foreground mt-1" />
          </div>
          <div>
            <h3 className="font-medium">Öffnungszeiten</h3>
            <div className="text-muted-foreground">{openingHours}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <LinkIcon className="h-5 w-5 text-muted-foreground mt-1" />

          <div className="w-full">
            <h3 className="font-medium">Links</h3>
            <CafeLinks cafe={cafe} />
          </div>
        </div>
      </div>
    </Card>
  );
}
