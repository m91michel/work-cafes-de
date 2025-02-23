import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  rating: number | null;
  className?: string;
}

export function FiveStarRating({ rating = 0, className = "" }: RatingProps) {
  const value = rating || 0;
  const roundedRating = Math.round(value * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;

  const renderStar = (index: number) => {
    if (index < fullStars) {
      return <Star className="fill-yellow-500 text-yellow-500" key={index} />;
    } else if (index === fullStars && hasHalfStar) {
      return (
        <div className="relative w-6 h-6" key={index}>
          <Star className="absolute text-yellow-500 w-6 h-6" />
          <StarHalf className="absolute fill-yellow-500 text-yellow-500 w-6 h-6" />
        </div>
      );
    } else {
      return <Star className="text-yellow-500" key={index} />;
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex" aria-hidden="true">
        {[...Array(5)].map((_, index) => renderStar(index))}
      </div>
      <span
        className="font-bold text-sm"
        aria-label={`${value.toFixed(1)} out of 5 stars`}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}
