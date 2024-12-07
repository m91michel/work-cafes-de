import { MapPin } from 'lucide-react';

interface CityHeroProps {
  cityName: string;
  cafeCount: number;
}

export function CityHero({ cityName, cafeCount }: CityHeroProps) {
  return (
    <div className="bg-card border-b">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="h-5 w-5" />
          <span>Germany</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Best Work-Friendly Cafes in {cityName}
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Discover {cafeCount} carefully selected {cafeCount === 1 ? 'cafe' : 'cafes'} perfect 
          for working and studying in {cityName}
        </p>
      </div>
    </div>
  );
}