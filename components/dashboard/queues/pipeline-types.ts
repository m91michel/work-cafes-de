import { Processed } from "@/libs/types";

export interface PipelineCafe {
  id: string;
  name: string;
  slug: string;
  city_slug: string;
  processed_at: string | null;
  status: string | null;
  processed?: Processed | null;
}

export interface PipelineStage {
  count: number;
  cafes: PipelineCafe[];
}

export interface PipelineData {
  evaluateCafes: PipelineStage;
  fetchReviewsCafes: PipelineStage;
  fetchAboutContentCafes: PipelineStage;
  updateMapDetailsCafes: PipelineStage;
  regularUpdateOfPublishedCafes: PipelineStage;
  updateImagesCafes: PipelineStage;
}

export interface PipelineQueryResponse {
  message: string;
  data: PipelineData;
}

export const PIPELINE_TITLES: Record<keyof PipelineData, string> = {
  evaluateCafes: 'Evaluate Cafes',
  fetchReviewsCafes: 'Fetch Reviews',
  fetchAboutContentCafes: 'Fetch About Content',
  updateMapDetailsCafes: 'Update Map Details',
  regularUpdateOfPublishedCafes: 'Regular Update',
  updateImagesCafes: 'Update Images',
};

