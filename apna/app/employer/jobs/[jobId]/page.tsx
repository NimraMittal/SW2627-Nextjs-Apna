"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EmployerSidebar from "../../../components/EmployerSidebar";
import ApplicantCard from "../../../components/ApplicantCard";

export default function JobApplicantsPage() {
  const params = useParams(); // gives us { jobId: "..." } from the URL
  type Applicant = {
    id: string;
    candidateName: string;
    resumeUrl?: string | null;
    status: string;
    interview?: { scheduledAt: string; platform: string } | null;
  };

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  // Pulled into its own function so we can call it again after any update
  const loadApplicants = useCallback(() => {
    fetch(`/api/jobs/${String(params.jobId)}/applicants`)
      .then((res) => res.json())
      .then((data) => {
        setApplicants(data);
        setLoading(false);
      });
  }, [params.jobId]);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <EmployerSidebar />

      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Applicants</h1>
        <p className="text-gray-500 text-sm mb-6">
          Review candidates, shortlist, and schedule interviews.
        </p>

        {loading && <p className="text-sm text-gray-400">Loading applicants...</p>}

        {!loading && applicants.length === 0 && (
          <p className="text-sm text-gray-400">No applicants yet for this job.</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {applicants.map((app) => (
            <ApplicantCard
              key={app.id}
              id={app.id}
              candidateName={app.candidateName}
              resumeUrl={app.resumeUrl}
              status={app.status}
              interview={app.interview}
              onUpdated={loadApplicants}
            />
          ))}
        </div>
      </div>
    </div>
  );
}