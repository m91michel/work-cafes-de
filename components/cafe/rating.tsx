'use client'

import { Star, StarHalf } from 'lucide-react'
import { Card } from '../ui/card';

interface RatingProps {
  rating?: number | null
  className?: string
}

export function CafeRatingCard({ rating }: { rating: number | null }) {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-3">Bewertung</h2>

      <div className="space-y-5">
        <Rating rating={rating} />
        <p className="text-sm text-muted-foreground">Quelle: Google</p>
      </div>
    </Card>
  );
}

export function Rating({ rating, className = '' }: RatingProps) {
  if (!rating) {
    return <p>Keine Bewertung</p>
  }

  const roundedRating = Math.round(rating * 2) / 2
  const fullStars = Math.floor(roundedRating)
  const hasHalfStar = roundedRating % 1 !== 0

  const renderStar = (index: number) => {
    if (index < fullStars) {
      return <Star className="fill-yellow-500 text-yellow-500" key={index} />
    } else if (index === fullStars && hasHalfStar) {
      return <div className="relative w-6 h-6" key={index}>
        <Star className="absolute text-yellow-500 w-6 h-6" />
        <StarHalf className="absolute fill-yellow-500 text-yellow-500 w-6 h-6" />
      </div>
    } else {
      return <Star className="text-yellow-500" key={index} />
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex" aria-hidden="true">
        {[...Array(5)].map((_, index) => renderStar(index))}
      </div>
      <span className="font-bold text-sm" aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}