// types/application.ts
// Shared Application types — used by candidate tracker (applications page)
// and employer applicant review (employer/jobs/[jobId]).
// Keep in sync with the Prisma `Application` + `StatusHistory` models.

export type ApplicationStatus = "PENDING" | "VIEWED" | "SHORTLISTED" | "REJECTED";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  currentStatus: ApplicationStatus;
  appliedAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface StatusHistoryEntry {
  applicationId: string;
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedBy: string;
  changedAt: string;
}

// Shape sent when a candidate applies to a job
export interface ApplyInput {
  jobId: string;
}

// Shape sent for a single status update
export interface UpdateStatusInput {
  status: ApplicationStatus;
}

// Shape sent for an employer bulk status update
export interface BulkUpdateStatusInput {
  applicationIds: string[];
  status: ApplicationStatus;
}