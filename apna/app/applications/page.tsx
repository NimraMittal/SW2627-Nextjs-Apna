"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import ApplicationCard from "../components/ApplicationCard";
import StatusTabs from "../components/StatusTabs";
import { Search, Bell, SlidersHorizontal, ArrowUpDown, RefreshCw, Briefcase } from "lucide-react";
import Link from "next/link";

type ApplicationItem = {
  id: string;
  jobId: string;
  jobTitle: string;
  jobLocation?: string;
  jobMode?: string;
  jobType?: string;
  companyName: string;
  currentStatus: "PENDING" | "VIEWED" | "SHORTLISTED" | "REJECTED";
  appliedAt: string;
  updatedAt: string;
  statusHistory?: Array<{
    previousStatus: string;
    newStatus: string;
    changedAt: string;
  }>;
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function formatUpdatedAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(iso);
  } catch {
    return "recently";
  }
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/applications");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setApplications(json.data);
      } else {
        setError(json.error?.message || "Failed to load applications");
      }
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchApplications());
  }, [fetchApplications]);

  // Connect to SSE for real-time application updates
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource("/api/sse");
      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "STATUS_CHANGED") {
            setRealtimeNotice(data.message || "Your application status was updated!");
            fetchApplications();
            setTimeout(() => setRealtimeNotice(null), 6000);
          }
        } catch {
          // ignore keepalive or parse err
        }
      };
    } catch {
      // SSE unsupported or offline
    }

    return () => {
      es?.close();
    };
  }, [fetchApplications]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: applications.length,
      pending: applications.filter((a) => a.currentStatus === "PENDING").length,
      viewed: applications.filter((a) => a.currentStatus === "VIEWED").length,
      shortlisted: applications.filter((a) => a.currentStatus === "SHORTLISTED").length,
      rejected: applications.filter((a) => a.currentStatus === "REJECTED").length,
    };
  }, [applications]);

  // Filtered by active tab and search query
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesTab = activeTab === "ALL" || app.currentStatus === activeTab;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        app.jobTitle.toLowerCase().includes(query) ||
        app.companyName.toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  }, [applications, activeTab, searchQuery]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="ml-64">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-80">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchApplications}
              title="Refresh"
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <Link href="/notifications" className="relative text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              AJ
            </div>
          </div>
        </div>

        {/* Live notification banner */}
        {realtimeNotice && (
          <div className="bg-green-50 border-b border-green-200 px-8 py-2.5 text-sm text-green-800 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {realtimeNotice}
            </div>
            <button
              onClick={() => setRealtimeNotice(null)}
              className="text-green-700 hover:text-green-900 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="p-8">
          {/* Page heading + Filter/Sort buttons */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-500 text-sm">
                Track and manage your job application progress in real-time.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-2 bg-white border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <SlidersHorizontal size={14} /> Reset
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                <ArrowUpDown size={14} /> Sort: Recent
              </button>
            </div>
          </div>

          {/* Status filter tabs */}
          <StatusTabs activeTab={activeTab} onChange={setActiveTab} counts={counts} />

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={fetchApplications}
                className="text-red-800 underline font-medium hover:text-red-950"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5 h-44 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredApps.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto mt-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={26} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {activeTab === "ALL" ? "No applications yet" : `No ${activeTab.toLowerCase()} applications`}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Explore open positions and submit your profile to top employers.
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                Browse Open Jobs
              </Link>
            </div>
          )}

          {/* Application cards grid */}
          {!loading && !error && filteredApps.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApps.map((app) => (
                <ApplicationCard
                  key={app.id}
                  title={app.jobTitle}
                  company={app.companyName}
                  location={app.jobLocation || app.jobMode || "Remote"}
                  status={app.currentStatus}
                  appliedDate={formatDate(app.appliedAt)}
                  updatedAgo={formatUpdatedAgo(app.updatedAt)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}