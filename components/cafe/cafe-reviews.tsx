import { getReviewsById } from "@/libs/supabase/reviews";
import { Cafe, Review } from "@/libs/types";
import { Card } from "../ui/card";
import dayjs from "dayjs";
import { reviewKeywords } from "@/app/api/_utils/reviews";
import Link from "next/link";

interface Props {
  cafe: Cafe;
}

export async function CafeReviews({ cafe }: Props) {
  const reviews = await getReviewsById(cafe?.id);

  if (reviews?.length === 0) {
    // Temporarily hide reviews
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-3">Ausgewählte Bewertungen</h2>
      <p className="text-sm text-muted-foreground/80 mb-6">
        Hier findest du ausgewählte Bewertungen, die wir für ein gutes Cafe zum
        Arbeiten als relevant betrachten.
      </p>

      {reviews.length > 0 ? (
        <div className="flex flex-col divide-y divide-border">
          {reviews.map((review) => (
            <CafeReview key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <EmptyReviews />
      )}
    </Card>
  );
}

function EmptyReviews() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">📝</div>
      <h3 className="text-lg font-medium mb-2">Noch keine Bewertungen</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Für dieses Café wurden noch keine Bewertungen hinzugefügt. Besuche das
        Café und teile deine Erfahrungen!
      </p>
    </div>
  );
}

interface CafeReviewProps {
  review: Review;
}

export function CafeReview({ review }: CafeReviewProps) {
  return (
    <div className="py-6 first:pt-0 last:pb-0 hover:bg-accent/5 transition-colors">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <span className="font-semibold text-lg">{review.author_name}</span>
            <span className="text-sm text-muted-foreground">
              {dayjs(review.created_at).format("DD.MM.YYYY")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {review.source_url ? (
              <Link
                href={review.source_url || ""}
                target="_blank"
                className="text-sm text-muted-foreground/80 font-medium hover:text-primary transition-colors"
                rel="noopener noreferrer nofollow"
                title={`${review.source} Bewertung`}
              >
                {review.source}
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground/80 font-medium">
                {review.source}
              </span>
            )}
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 px-2 py-1 rounded-md">
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {review.rating}
              </span>
              <span className="text-yellow-500">★</span>
            </div>
          </div>
        </div>

        <p
          className="text-base leading-relaxed text-foreground/80"
          dangerouslySetInnerHTML={{
            __html: getReviewText(review),
          }}
        />
      </div>
    </div>
  );
}

function getReviewText(review: Review) {
  // Get text in the correct language
  let text = "";
  if (review.text_de) {
    text = review.text_de;
  } else if (review.text_en) {
    text = review.text_en;
  } else if (review.text_original) {
    text = review.text_original;
  }

  if (text.length === 0) {
    return "";
  }

  // Replace newlines with <br /> tags
  text = text.replace(/\n/g, "<br />");

  // Highlight keywords
  text = highlightKeywords(text, reviewKeywords);

  return text;
}

function highlightKeywords(text: string, keywords: string[]) {
  // Highlight keywords in the text
  keywords.forEach((keyword) => {
    text = text.replace(
      new RegExp(keyword, "gi"),
      `<strong class="font-bold">${keyword}</strong>`
    );
  });
  return text;
}
