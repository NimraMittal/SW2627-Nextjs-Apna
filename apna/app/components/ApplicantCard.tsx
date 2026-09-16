"use client";

import { useState } from "react";
import ScheduleInterviewForm from "./ScheduleInterviewForm";

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-600",
  VIEWED: "bg-blue-100 text-blue-600",
  SHORTLISTED: "bg-green-100 text-green-600",
  REJECTED: "bg-red-100 text-red-600",
};

// props: application data + a function to call after a status change,
// so the parent page can refresh the list
type ApplicantCardProps = {
  id: string;
  candidateName: string;
  resumeUrl?: string | null;
  status: string;
  interview?: { scheduledAt: string; platform: string } | null;
  onUpdated: () => void;
};

export default function ApplicantCard(props: ApplicantCardProps) {
  const [showSchedule, setShowSchedule] = useState(false);

  async function updateStatus(newStatus: string) {
    await fetch(`/api/applications/${props.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    props.onUpdated(); // tell the parent to refresh the applicant list
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      
      {/* Name + status badge */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{props.candidateName}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[props.status]}`}>
          {props.status}
        </span>
      </div>

      {/* Resume link — only shows if a resume was submitted */}
      {props.resumeUrl ? (
        <a
          href={props.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline"
        >
          View Resume
        </a>
      ) : (
        <p className="text-sm text-gray-400">No resume uploaded</p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => updateStatus("SHORTLISTED")}
          className="flex-1 bg-green-600 text-white text-sm py-1.5 rounded-lg"
        >
          Shortlist
        </button>
        <button
          onClick={() => updateStatus("REJECTED")}
          className="flex-1 bg-red-500 text-white text-sm py-1.5 rounded-lg"
        >
          Reject
        </button>
      </div>

      {/* Interview section */}
      {props.interview ? (
        <p className="text-xs text-gray-500 mt-3">
          Interview scheduled: {new Date(props.interview.scheduledAt).toLocaleString()} (
          {props.interview.platform})
        </p>
      ) : showSchedule ? (
        <ScheduleInterviewForm
          applicationId={props.id}
          onScheduled={() => {
            setShowSchedule(false);
            props.onUpdated();
          }}
        />
      ) : (
        <button
          onClick={() => setShowSchedule(true)}
          className="text-sm text-blue-600 font-medium mt-3"
        >
          + Schedule Interview
        </button>
      )}
    </div>
  );
}