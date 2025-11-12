// Job registry for type-safe processing (internal imports)
import * as googleMapsJobs from './cafe-fetch-google-maps-details';
import * as updateCafeStatsJobs from './update-cafe-stats';
import * as cafeFetchReviewsJobs from './cafe-fetch-reviews';
import * as cafeEvalPublishStatusJobs from './cafe-eval-publish-status';

type CafeJobData = {
  cafeId: string;
}
export type JobData = CafeJobData | any;

export type JobHandler = (job: any) => Promise<any>;

export const jobHandlers: Record<string, JobHandler> = {
  [googleMapsJobs.JOB_NAME]: googleMapsJobs.processJob,
  [updateCafeStatsJobs.JOB_NAME]: updateCafeStatsJobs.processJob,
  [cafeFetchReviewsJobs.JOB_NAME]: cafeFetchReviewsJobs.processJob,
  [cafeEvalPublishStatusJobs.JOB_NAME]: cafeEvalPublishStatusJobs.processJob,
};

export const enqueue = {
  cafeFetchGoogleMapsDetails: googleMapsJobs.enqueueJob,
  updateCafeStats: updateCafeStatsJobs.enqueueJob,
  cafeFetchReviews: cafeFetchReviewsJobs.enqueueJob,
  cafeEvalPublishStatus: cafeEvalPublishStatusJobs.enqueueJob,
}
