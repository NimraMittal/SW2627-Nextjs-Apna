// lib/api.ts
//
// Single place every page/component calls into the backend from.
// Matches the { success, data } / { success: false, error: { code, message } }
// envelope already used by lib/api-response.ts (ok/fail) on the server.
//
// Why this file exists: pages currently do raw fetch() calls with slightly
// different assumptions about the response shape. Centralizing here means
// when a backend route's shape changes, you fix it once instead of hunting
// through every page.

import type { Job, CreateJobInput, JobListParams } from "@/types/job";
import type {
  Application,
  ApplyInput,
  UpdateStatusInput,
  BulkUpdateStatusInput,
} from "@/types/application";

// ---- Envelope types (mirrors lib/api-response.ts) -------------------------

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: { code: string; message: string };
}

type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

// ---- Core request helper ---------------------------------------------------

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Guard against non-JSON responses (e.g. a 404 HTML page from a missing route)
  let body: ApiEnvelope<T> | null = null;
  try {
    body = await res.json();
  } catch {
    throw new ApiError(
      "INVALID_RESPONSE",
      `Expected JSON from ${path} but got something else (status ${res.status}). Is the route implemented?`,
      res.status
    );
  }

  if (!body || body.success === false) {
    const err = body && body.success === false ? body.error : null;
    throw new ApiError(
      err?.code ?? "UNKNOWN_ERROR",
      err?.message ?? `Request to ${path} failed with status ${res.status}`,
      res.status
    );
  }

  return body.data;
}

function toQueryString(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries as [string, string][]).toString();
}

// ---- Jobs -------------------------------------------------------------------

export function getJobs(params: JobListParams = {}): Promise<Job[]> {
  const qs = toQueryString({
    companyId: params.companyId,
    search: params.search,
    location: params.location,
  });
  return request<Job[]>(`/api/jobs${qs}`);
}

export function getJob(jobId: string): Promise<Job> {
  return request<Job>(`/api/jobs/${jobId}`);
}

export function createJob(input: CreateJobInput): Promise<Job> {
  return request<Job>("/api/jobs", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getJobApplicants(jobId: string): Promise<Application[]> {
  return request<Application[]>(`/api/jobs/${jobId}/applicants`);
}

// ---- Applications (candidate side) ------------------------------------------

export function getApplications(): Promise<Application[]> {
  return request<Application[]>("/api/applications");
}

export function applyToJob(input: ApplyInput): Promise<Application> {
  return request<Application>(`/api/jobs/${input.jobId}/apply`, {
    method: "POST",
  });
}

// ---- Applications (employer side) -------------------------------------------

export function getEmployerApplications(
  companyId: string
): Promise<Application[]> {
  const qs = toQueryString({ companyId });
  return request<Application[]>(`/api/employer/applications${qs}`);
}

export function updateApplicationStatus(
  applicationId: string,
  input: UpdateStatusInput
): Promise<Application> {
  return request<Application>(`/api/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function bulkUpdateApplicationStatus(
  input: BulkUpdateStatusInput
): Promise<Application[]> {
  return request<Application[]>("/api/applications/bulk-status", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}