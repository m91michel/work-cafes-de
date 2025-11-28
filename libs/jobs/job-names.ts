export const JOB_NAMES = {
  // Cafe jobs
  googleMapsDetails: "CAFE_FETCH_GOOGLE_MAPS_DETAILS",
  googleMapsImages: "CAFE_FETCH_GOOGLE_MAPS_IMAGES",
  cafeFetchReviews: "CAFE_FETCH_REVIEWS",
  cafeEvalPublishStatus: "CAFE_EVAL_PUBLISH_STATUS",
  cafeFetchAboutContent: "CAFE_FETCH_ABOUT_CONTENT",
  cafeProcessDuplicates: "CAFE_PROCESS_DUPLICATES",
  // City jobs
  cityUpdateCafeStats: "CITY_UPDATE_CAFE_STATS",
  citySearchForCafes: "CITY_SEARCH_FOR_CAFES",
  cityGenerateImage: "CITY_GENERATE_IMAGE",
  cityGenerateDescription: "CITY_GENERATE_DESCRIPTION",
  // Cron jobs
  cityScheduler: "CITY_SCHEDULER",
  cafeScheduler: "CAFE_SCHEDULER",
} as const;
