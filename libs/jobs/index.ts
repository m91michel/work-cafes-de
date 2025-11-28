// Job registry for type-safe processing (internal imports)
import * as googleMapsJobs from './cafe/fetch-google-maps-details';
import * as googleMapsImagesJobs from './cafe/fetch-google-maps-images';
import * as updateCafeStatsJobs from './city/update-cafe-stats';
import * as cafeFetchReviewsJobs from './cafe/cafe-fetch-reviews';
import * as cafeEvalPublishStatusJobs from './cafe/cafe-eval-publish-status';
import * as cafeFetchAboutContentJobs from './cafe/fetch-about-content';
import * as cafeSchedulerJobs from './cron/cafe-scheduler';
import * as citySchedulerJobs from './cron/city-scheduler';
import * as citySearchForCafesJobs from './city/city-search-for-cafes';
import * as cafeProcessDuplicatesJobs from './cafe/cafe-process-duplicates';
import * as cityGenerateImageJobs from './city/city-generate-image';
import * as cityGenerateDescriptionJobs from './city/city-generate-description';

type CafeJobData = {
  cafeId: string;
}
export type JobData = CafeJobData | any;

export type JobHandler = (job: any) => Promise<any>;

export const jobHandlers: Record<string, JobHandler> = {
  // Cafe jobs
  [googleMapsJobs.JOB_NAME]: googleMapsJobs.processJob,
  [googleMapsImagesJobs.JOB_NAME]: googleMapsImagesJobs.processJob,
  [cafeFetchReviewsJobs.JOB_NAME]: cafeFetchReviewsJobs.processJob,
  [cafeEvalPublishStatusJobs.JOB_NAME]: cafeEvalPublishStatusJobs.processJob,
  [cafeFetchAboutContentJobs.JOB_NAME]: cafeFetchAboutContentJobs.processJob,
  [cafeProcessDuplicatesJobs.JOB_NAME]: cafeProcessDuplicatesJobs.processJob,
  // City jobs
  [updateCafeStatsJobs.JOB_NAME]: updateCafeStatsJobs.processJob,
  [citySearchForCafesJobs.JOB_NAME]: citySearchForCafesJobs.processJob,
  [cityGenerateImageJobs.JOB_NAME]: cityGenerateImageJobs.processJob,
  [cityGenerateDescriptionJobs.JOB_NAME]: cityGenerateDescriptionJobs.processJob,
  // Cron jobs
  [cafeSchedulerJobs.JOB_NAME]: cafeSchedulerJobs.processJob,
  [citySchedulerJobs.JOB_NAME]: citySchedulerJobs.processJob,
  // Backward compatibility: handle old job name
  "UPDATE_CAFE_STATS": updateCafeStatsJobs.processJob,
};

export const enqueue = {
  // Cafe jobs
  cafeFetchGoogleMapsDetails: googleMapsJobs.enqueueJob,
  cafeFetchGoogleMapsImages: googleMapsImagesJobs.enqueueJob,
  cafeFetchReviews: cafeFetchReviewsJobs.enqueueJob,
  cafeEvalPublishStatus: cafeEvalPublishStatusJobs.enqueueJob,
  cafeFetchAboutContent: cafeFetchAboutContentJobs.enqueueJob,
  
  cafeProcessDuplicates: cafeProcessDuplicatesJobs.enqueueJob,
  // City jobs
  citySearchForCafes: citySearchForCafesJobs.enqueueJob,
  cityUpdateCafeStats: updateCafeStatsJobs.enqueueJob,
  cityGenerateImage: cityGenerateImageJobs.enqueueJob,
  cityGenerateDescription: cityGenerateDescriptionJobs.enqueueJob,
  // Cron jobs
  cafeScheduler: cafeSchedulerJobs.enqueueJob,
  cityScheduler: citySchedulerJobs.enqueueJob,
}
