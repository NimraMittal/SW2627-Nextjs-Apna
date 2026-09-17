"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmployerSidebar from "../components/EmployerSidebar";
import { getCompanyId, setCompanyId } from "@/lib/companyId";

export default function EmployerDashboard() {
  type Job = {
    id: string;
    title: string;
    location: string;
    applications?: unknown[];
  };

  const [companyId, setCompanyIdState] = useState<string | null>(() => getCompanyId());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Temporary company setup fields (shown only if no companyId saved yet)
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  // Once we have a companyId, fetch that company's jobs
  useEffect(() => {
    if (!companyId) return;

    fetch(`/api/jobs?companyId=${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      });
  }, [companyId]);

  // TEMPORARY: creates a company record so we have something to work with
  async function handleCreateCompany() {
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: companyName, email: companyEmail }),
    });
    const company = await res.json();

    setCompanyId(company.id);
    setCompanyIdState(company.id);
  }

  // If there's no companyId yet, show a simple one-time setup form
  if (!companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-xl p-8 w-96">
          <h1 className="text-xl font-bold mb-1">Set up your company</h1>
          <p className="text-sm text-gray-500 mb-4">
            (Temporary step until real employer login is built)
          </p>

          <input
            type="text"
            placeholder="Company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
          />
          <input
            type="email"
            placeholder="Company email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
          />

          <button
            onClick={handleCreateCompany}
            className="w-full bg-blue-700 text-white text-sm font-medium py-2 rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <EmployerSidebar />

      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-gray-500 text-sm">Jobs your company has posted.</p>
          </div>
          <Link
            href="/employer/jobs/new"
            className="bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            + Post New Job
          </Link>
        </div>

        {loading && <p className="text-sm text-gray-400">Loading jobs...</p>}

        {!loading && jobs.length === 0 && (
          <p className="text-sm text-gray-400">
            No jobs posted yet. Click &quot;Post New Job&quot; to add one.
          </p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/employer/jobs/${job.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400"
            >
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{job.location}</p>
              <p className="text-sm text-blue-600 font-medium">
                {job.applications?.length || 0} applicant
                {job.applications?.length === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}