"use client";

import { useState } from "react";
import { Bookmark, Check, Loader2, MapPin, DollarSign, Briefcase, Info } from "lucide-react";

export type JobCardProps = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  mode: string;
  description?: string;
  skills?: string[];
  postedAgo: string;
  isApplied?: boolean;
  onApply?: (jobId: string) => Promise<void> | void;
};

export default function JobCard(props: JobCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(props.isApplied ?? false);
  const [bookmarked, setBookmarked] = useState(false);

  async function handleApplyClick() {
    if (applied || applying) return;
    setApplying(true);
    try {
      if (props.onApply) {
        await props.onApply(props.id);
      } else {
        const res = await fetch(`/api/jobs/${props.id}/apply`, { method: "POST" });
        const json = await res.json();
        if (!res.ok && json.error?.code !== "CONFLICT") {
          alert(json.error?.message || "Failed to apply");
          return;
        }
      }
      setApplied(true);
    } catch {
      alert("Error submitting application. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  return (
    <>
      <div className="bg-white border border-gray-200 hover:border-blue-200 transition-all rounded-xl p-5 shadow-xs hover:shadow-sm flex flex-col justify-between">
        <div>
          {/* Top row: logo placeholder + bookmark icon */}
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm shrink-0">
              {props.company?.[0]?.toUpperCase() || "J"}
            </div>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
              title="Save Job"
            >
              <Bookmark
                size={18}
                className={bookmarked ? "fill-blue-600 text-blue-600" : ""}
              />
            </button>
          </div>

          {/* Job title + company */}
          <h3 className="font-semibold text-gray-900 text-base mb-1">{props.title}</h3>
          <p className="text-sm text-blue-600 font-medium mb-3">
            {props.company} • {props.location}
          </p>

          {/* Tags: job type, salary, work mode */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
              {props.type}
            </span>
            <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
              {props.salary}
            </span>
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
              {props.mode}
            </span>
          </div>

          {props.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-4">
              {props.description}
            </p>
          )}
        </div>

        {/* Bottom row: posted time + Apply / Details buttons */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
          <span className="text-xs text-gray-400">{props.postedAgo}</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="text-xs text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium transition-colors"
            >
              Details
            </button>

            {applied ? (
              <button
                disabled
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-3.5 py-1.5 rounded-lg flex items-center gap-1 cursor-default"
              >
                <Check size={14} /> Applied
              </button>
            ) : (
              <button
                onClick={handleApplyClick}
                disabled={applying}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {applying ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Applying...
                  </>
                ) : (
                  "Apply Now"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-fadeIn">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{props.title}</h2>
                <p className="text-sm font-medium text-blue-600">{props.company}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                <MapPin size={12} /> {props.location}
              </span>
              <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                <DollarSign size={12} /> {props.salary}
              </span>
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                <Briefcase size={12} /> {props.mode} ({props.type})
              </span>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Description
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {props.description || "No specific description provided."}
              </p>
            </div>

            {props.skills && props.skills.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {props.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 font-medium"
              >
                Close
              </button>
              {applied ? (
                <button
                  disabled
                  className="bg-emerald-50 text-emerald-700 text-sm font-medium px-5 py-2 rounded-xl flex items-center gap-1.5 border border-emerald-200 cursor-default"
                >
                  <Check size={16} /> Applied
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await handleApplyClick();
                    setShowModal(false);
                  }}
                  disabled={applying}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white text-sm font-medium px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {applying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Applying...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}