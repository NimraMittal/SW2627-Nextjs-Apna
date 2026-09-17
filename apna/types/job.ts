// types/job.ts
// Shared Job types — used by both candidate-facing pages (jobs, saved-jobs)
// and employer-facing pages (employer dashboard, job creation, applicants).
// Keep this in sync with the Prisma `Job` model once backend adds it.

export type JobStatus = "OPEN" | "CLOSED" | "DRAFT";

export interface Job {
  id: string;
  employerId: string;
  companyName: string;
  title: string;
  description: string;
  location: string;
  salary: string | null;
  skills: string[];
  type: string; // "Full-time" | "Part-time" | "Contract" | etc.
  mode: string; // "Remote" | "On-site" | "Hybrid"
  status: JobStatus;
  createdAt: string; // ISO date string
  applicantCount?: number;
}

// Shape sent when creating a job (employer/jobs/new)
export interface CreateJobInput {
  companyId: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  skills?: string[];
  type: string;
  mode: string;
}

// Query params supported by GET /api/jobs
export interface JobListParams {
  companyId?: string;
  search?: string;
  location?: string;
}