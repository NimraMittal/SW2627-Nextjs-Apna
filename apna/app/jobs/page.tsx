"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import { Search, MapPin, CheckCircle2 } from "lucide-react";
import { getJobs, getApplications, applyToJob, ApiError } from "@/lib/api";
import type { Job } from "@/types/job";

function formatPostedAgo(isoDate: string): string {
  try {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  } catch {
    return "Recently";
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsData, appsData] = await Promise.all([
        getJobs(),
        getApplications().catch(() => []), // in case not logged in
      ]);
      setJobs(jobsData);
      if (Array.isArray(appsData)) {
        setAppliedJobIds(new Set(appsData.map((a) => a.jobId)));
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => loadData());
  }, [loadData]);

  async function handleApply(jobId: string) {
    try {
      await applyToJob({ jobId });
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
      setToastMessage("Application submitted successfully!");
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to apply.";
      alert(msg);
    }
  }

  // Client-side filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation =
        locationTerm.trim() === "" ||
        job.location.toLowerCase().includes(locationTerm.toLowerCase());
      return matchesSearch && matchesLocation;
    });
  }, [jobs, searchTerm, locationTerm]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="ml-64">
        <Topbar />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        <div className="p-8">
          {/* Page heading */}
          <h1 className="text-2xl font-bold text-gray-900">Find your next role</h1>
          <p className="text-blue-600 text-sm mb-6">
            Explore active job opportunities and apply directly to top companies.
          </p>

          {/* Search row */}
          <div className="flex gap-3 mb-4">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-sm w-full"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-64">
              <MapPin size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="City, state, or Remote"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                className="outline-none text-sm w-full"
              />
            </div>

            <button
              onClick={loadData}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors shadow-xs"
            >
              Search
            </button>
          </div>

          {/* Filter row */}
          <div className="flex items-center justify-between mb-6">
            <JobFilters />
            {!loading && !error && (
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-800">{filteredJobs.length}</span> open position{filteredJobs.length === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5 h-56 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <button
                onClick={loadData}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredJobs.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center max-w-md mx-auto">
              <p className="text-base font-semibold text-gray-800 mb-1">No jobs match your search</p>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your keywords or location filter.</p>
              <button
                onClick={() => { setSearchTerm(""); setLocationTerm(""); }}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Job cards grid */}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.companyName}
                  location={job.location}
                  type={job.type}
                  salary={job.salary ?? "Competitive"}
                  mode={job.mode}
                  description={job.description}
                  skills={job.skills}
                  postedAgo={formatPostedAgo(job.createdAt)}
                  isApplied={appliedJobIds.has(job.id)}
                  onApply={handleApply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}