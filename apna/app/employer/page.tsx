"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import EmployerSidebar from "../components/EmployerSidebar";
import { Plus, Users, Briefcase, MapPin, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

type EmployerJob = {
  id: string;
  title: string;
  location: string;
  type: string;
  mode: string;
  salary?: string;
  applicantCount: number;
  companyName: string;
};

export default function EmployerDashboard() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEmployer = session?.user?.role === "EMPLOYER";
  const companyId = session?.user?.companyId;

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // If companyId is available, filter by companyId; otherwise fetch all jobs
      const url = companyId ? `/api/jobs?companyId=${companyId}` : "/api/jobs";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setJobs(json.data);
      } else {
        setError(json.error?.message || "Failed to load jobs");
      }
    } catch {
      setError("Failed to fetch employer jobs.");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    void Promise.resolve().then(() => loadJobs());
  }, [loadJobs]);

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <EmployerSidebar />

      <div className="ml-64 p-8">
        {/* Auth prompt if not logged in as employer */}
        {status !== "loading" && !isEmployer && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-amber-600" size={24} />
              <div>
                <h4 className="font-semibold text-amber-900 text-sm">
                  You are browsing in preview mode
                </h4>
                <p className="text-xs text-amber-700">
                  Log in as an Employer to post new jobs and manage candidates.
                  <span className="font-mono ml-1 font-semibold">employer@techcorp.com / password123</span>
                </p>
              </div>
            </div>
            <Link
              href="/auth"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Sign In as Employer
            </Link>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Employer Portal</h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {session?.user?.name ? `${session.user.name}` : "TechCorp Solutions"}
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Manage your company&apos;s active job postings and candidate pipelines.
            </p>
          </div>

          <Link
            href="/employer/jobs/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus size={16} /> Post New Job
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Active Listings
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{jobs.length}</div>
            <p className="text-xs text-gray-500">Live positions open for applications</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Applicants
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalApplicants}</div>
            <p className="text-xs text-gray-500">Candidates reviewed & in review</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Live Status Updates
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
            </div>
            <div className="text-sm font-semibold text-purple-700 mb-1">Real-time SSE Active</div>
            <p className="text-xs text-gray-500">Candidate notifications push instantly</p>
          </div>
        </div>

        {/* Jobs List Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Your Job Postings</h2>
          <span className="text-xs text-gray-400">Click any job to manage applicants</span>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-5 h-44 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto">
            <Briefcase size={36} className="text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">No jobs posted yet</h3>
            <p className="text-xs text-gray-500 mb-6">
              Create your first job listing to begin receiving candidates.
            </p>
            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              <Plus size={14} /> Create Listing
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/employer/jobs/${job.id}`}
                className="group bg-white border border-gray-200 hover:border-blue-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                      {job.type} • {job.mode}
                    </span>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Open
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                    <MapPin size={12} /> {job.location}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                    <Users size={14} className="text-blue-600" />
                    <span className="font-bold text-gray-900">{job.applicantCount || 0}</span>{" "}
                    applicant{(job.applicantCount || 0) === 1 ? "" : "s"}
                  </div>
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Review <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}