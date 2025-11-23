import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import {
  getCafesForGoogleMapsDetails,
  getCafesForGoogleMapsImages,
  getCafesToEvaluate,
  getCafesToFetchAboutContent,
  getCafesToFetchReviews,
} from "@/libs/supabase/cafe/processing-queries";
import { pick } from "lodash";
import { Cafe } from "@/libs/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (isProd) {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  const evaluateCafes = await getCafesToEvaluate({ limit: 10 });
  const fetchReviewsCafes = await getCafesToFetchReviews({ limit: 10 });
  const fetchAboutContentCafes = await getCafesToFetchAboutContent({
    limit: 10,
  });
  const updateMapDetailsCafes = await getCafesForGoogleMapsDetails({
    limit: 10,
  });
  const updateImagesCafes = await getCafesForGoogleMapsImages({ limit: 10 });

  return NextResponse.json({
    message: "success",
    data: {
      evaluateCafes: {
        count: evaluateCafes.count,
        cafes: mapCafeToResponse(evaluateCafes.data),
      },
      fetchReviewsCafes: {
        count: fetchReviewsCafes.count,
        cafes: mapCafeToResponse(fetchReviewsCafes.data),
      },
      fetchAboutContentCafes: {
        count: fetchAboutContentCafes.count,
        cafes: mapCafeToResponse(fetchAboutContentCafes.data),
      },
      updateMapDetailsCafes: {
        count: updateMapDetailsCafes.count,
        cafes: mapCafeToResponse(updateMapDetailsCafes.data),
      },
      updateImagesCafes: {
        count: updateImagesCafes.count,
        cafes: mapCafeToResponse(updateImagesCafes.data),
      },
    },
  });
}

function mapCafeToResponse(cafes: Cafe[]) {
  return cafes.map((cafe) =>
    pick(cafe, ["id", "name", "slug", "city_slug", "processed_at", "status"])
  );
}
