"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import { Search, MapPin } from "lucide-react";
import { getJobs, ApiError } from "@/lib/api";
import type { Job } from "@/types/job";

// Turns an ISO date string into "2 days ago" / "Just now" for JobCard's postedAgo prop.
function formatPostedAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  function loadJobs() {
    setLoading(true);
    setError(null);
    getJobs()
      .then((data) => setJobs(data))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load jobs.")
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadJobs();
  }, []);

  // Client-side filtering on top of whatever the API returned.
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

        <div className="p-8">
          {/* Page heading */}
          <h1 className="text-2xl font-bold text-gray-900">Find your next role</h1>
          <p className="text-blue-600 text-sm mb-6">
            Explore thousands of job opportunities.
          </p>

          {/* Search row: job search box + location box + Search button */}
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
                placeholder="City, state, or zip code"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                className="outline-none text-sm w-full"
              />
            </div>

            <button
              onClick={loadJobs}
              className="bg-blue-600 text-white text-sm font-medium px-6 rounded-lg"
            >
              Search Jobs
            </button>
          </div>

          {/* Filter buttons + job count */}
          <div className="flex items-center justify-between mb-6">
            <JobFilters />
            {!loading && !error && (
              <p className="text-sm text-gray-400">
                Showing {filteredJobs.length} job{filteredJobs.length === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5 h-40 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <button
                onClick={loadJobs}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredJobs.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
              <p className="text-sm text-gray-500">
                No jobs match your search right now.
              </p>
            </div>
          )}

          {/* Job cards grid */}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  company={job.companyName}
                  location={job.location}
                  type={job.type}
                  salary={job.salary ?? "Not specified"}
                  mode={job.mode}
                  postedAgo={formatPostedAgo(job.createdAt)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}