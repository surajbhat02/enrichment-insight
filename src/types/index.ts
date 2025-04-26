export type JobStatus = "completed" | "running" | "failed" | "pending";

export interface EnrichmentJob {
  id: string;
  name: string;
  status: JobStatus;
  startTime: Date;
  endTime?: Date;
  datasetType: string;
  dependentJobs?: EnrichmentJob[]; // For nesting
}
