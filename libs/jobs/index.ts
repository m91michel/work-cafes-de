// Job registry for type-safe processing (internal imports)
import * as googleMapsJobs from './cafe/fetch-google-maps-details';
import * as googleMapsImagesJobs from './cafe/fetch-google-maps-images';
import * as updateCafeStatsJobs from './cron/update-cafe-stats';
import * as cafeFetchReviewsJobs from './cafe/cafe-fetch-reviews';
import * as cafeEvalPublishStatusJobs from './cafe/cafe-eval-publish-status';
import * as cafeFetchAboutContentJobs from './cafe/fetch-about-content';
import * as cafeSchedulerJobs from './cron/cafe-scheduler';
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
  [googleMapsJobs.JOB_NAME]: googleMapsJobs.processJob,
  [googleMapsImagesJobs.JOB_NAME]: googleMapsImagesJobs.processJob,
  [updateCafeStatsJobs.JOB_NAME]: updateCafeStatsJobs.processJob,
  [cafeFetchReviewsJobs.JOB_NAME]: cafeFetchReviewsJobs.processJob,
  [cafeEvalPublishStatusJobs.JOB_NAME]: cafeEvalPublishStatusJobs.processJob,
  [cafeFetchAboutContentJobs.JOB_NAME]: cafeFetchAboutContentJobs.processJob,
  [cafeSchedulerJobs.JOB_NAME]: cafeSchedulerJobs.processJob,
  [citySearchForCafesJobs.JOB_NAME]: citySearchForCafesJobs.processJob,
  [cafeProcessDuplicatesJobs.JOB_NAME]: cafeProcessDuplicatesJobs.processJob,
  [cityGenerateImageJobs.JOB_NAME]: cityGenerateImageJobs.processJob,
  [cityGenerateDescriptionJobs.JOB_NAME]: cityGenerateDescriptionJobs.processJob,
};

export const enqueue = {
  cafeFetchGoogleMapsDetails: googleMapsJobs.enqueueJob,
  cafeFetchGoogleMapsImages: googleMapsImagesJobs.enqueueJob,
  updateCafeStats: updateCafeStatsJobs.enqueueJob,
  cafeFetchReviews: cafeFetchReviewsJobs.enqueueJob,
  cafeEvalPublishStatus: cafeEvalPublishStatusJobs.enqueueJob,
  cafeFetchAboutContent: cafeFetchAboutContentJobs.enqueueJob,
  cafeScheduler: cafeSchedulerJobs.enqueueJob,
  citySearchForCafes: citySearchForCafesJobs.enqueueJob,
  cafeProcessDuplicates: cafeProcessDuplicatesJobs.enqueueJob,
  cityGenerateImage: cityGenerateImageJobs.enqueueJob,
  cityGenerateDescription: cityGenerateDescriptionJobs.enqueueJob,
}
