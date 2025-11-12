import { Review } from "./types";
import { AIReview } from "./openai/analyze-reviews";

export function prepareReviews(reviews: Review[]): AIReview[] {
    if (reviews.length === 0) {
      return [];
    }
  
    return reviews.map((review) => ({
      name: review.author_name || "",
      date: review.created_at || "",
      review: getReviewText(review),
    }));
  }
  
  export function getReviewText(review: Review) {
    if (review.text_en) {
      return review.text_en;
    }
  
    if (review.text_de) {
      return review.text_de;
    }
  
    return review.text_original || "";
  }