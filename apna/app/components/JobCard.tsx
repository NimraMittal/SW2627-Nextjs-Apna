import { Bookmark } from "lucide-react";

// Shows ONE job listing. Data comes in through props.
type JobCardProps = {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  mode: string;
  postedAgo: string;
};

export default function JobCard(props: JobCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      
      {/* Top row: logo placeholder + bookmark icon */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100" />
        <Bookmark size={18} className="text-gray-400" />
      </div>

      {/* Job title + company */}
      <h3 className="font-semibold text-gray-900">{props.title}</h3>
      <p className="text-sm text-blue-600 mb-3">
        {props.company} • {props.location}
      </p>

      {/* Tags: job type, salary, work mode */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">{props.type}</span>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">{props.salary}</span>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">{props.mode}</span>
      </div>

      {/* Bottom row: posted time + View Job button */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400">{props.postedAgo}</span>
        <button className="bg-blue-100 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-lg">
          View Job
        </button>
      </div>
    </div>
  );
}