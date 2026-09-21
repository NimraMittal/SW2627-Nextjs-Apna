"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import EmployerSidebar from "../../../components/EmployerSidebar";
import ApplicantCard from "../../../components/ApplicantCard";
import { ArrowLeft, Users, RefreshCw } from "lucide-react";

type Applicant = {
  id: string;
  candidateName: string;
  candidateEmail?: string;
  resumeUrl?: string | null;
  status: string;
  interview?: { scheduledAt: string; platform: string } | null;
};

type JobMeta = {
  id: string;
  title: string;
  location: string;
  companyName: string;
};

export default function JobApplicantsPage() {
  const params = useParams();
  const jobId = String(params.jobId);

  const [job, setJob] = useState<JobMeta | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobRes, appsRes] = await Promise.all([
        fetch(`/api/jobs/${jobId}`),
        fetch(`/api/jobs/${jobId}/applicants`),
      ]);

      const [jobJson, appsJson] = await Promise.all([
        jobRes.json().catch(() => null),
        appsRes.json().catch(() => null),
      ]);

      if (jobJson?.success && jobJson.data) {
        setJob(jobJson.data);
      }

      if (appsJson?.success && Array.isArray(appsJson.data)) {
        setApplicants(appsJson.data);
      } else if (Array.isArray(appsJson)) {
        setApplicants(appsJson);
      } else if (!appsRes.ok) {
        setError(appsJson?.error?.message || "Failed to load applicants");
      }
    } catch {
      setError("Failed to fetch applicants. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    void Promise.resolve().then(() => loadData());
  }, [loadData]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <EmployerSidebar />

      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/employer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft size={14} /> Back to My Jobs
          </Link>

          <button
            onClick={loadData}
            title="Refresh applicants"
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {job?.title || "Job Applicants"}
                </h1>
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full">
                  {job?.location || "Review"}
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                Review candidate applications, shortlist, reject, or schedule live interviews.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">
                  Total Submissions
                </span>
                <span className="text-2xl font-bold text-gray-900">{applicants.length}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 h-48 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && !error && applicants.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto">
            <Users size={36} className="text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">No applicants yet</h3>
            <p className="text-xs text-gray-500">
              Candidates who apply to this role will appear here automatically with their resumes.
            </p>
          </div>
        )}

        {!loading && applicants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {applicants.map((app) => (
              <ApplicantCard
                key={app.id}
                id={app.id}
                candidateName={app.candidateName}
                resumeUrl={app.resumeUrl}
                status={app.status}
                interview={app.interview}
                onUpdated={loadData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}