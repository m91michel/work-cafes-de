// Job registry for type-safe processing (internal imports)
import * as googleMapsJobs from './cafe-fetch-google-maps-details';
import * as updateCafeStatsJobs from './update-cafe-stats';

export type JobData = googleMapsJobs.JobData | updateCafeStatsJobs.JobData;

export type JobHandler = (job: any) => Promise<any>;

export const jobHandlers: Record<string, JobHandler> = {
  [googleMapsJobs.JOB_NAME]: googleMapsJobs.processJob,
  [updateCafeStatsJobs.JOB_NAME]: updateCafeStatsJobs.processJob,
};

// Export job names as constants for type safety
export const JOB_NAMES = {
  [googleMapsJobs.JOB_NAME]: googleMapsJobs.JOB_NAME,
  [updateCafeStatsJobs.JOB_NAME]: updateCafeStatsJobs.JOB_NAME,
} as const;

export const enqueue = {
  cafeFetchGoogleMapsDetails: googleMapsJobs.enqueueJob,
  updateCafeStats: updateCafeStatsJobs.enqueueJob,
}