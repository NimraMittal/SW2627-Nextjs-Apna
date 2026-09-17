import { MoreVertical, ChevronRight, Calendar, Archive } from "lucide-react";

// Colors change depending on the application's status
const statusStyles: Record<string, { border: string; dot: string; text: string }> = {
  Pending: { border: "border-l-orange-400", dot: "bg-orange-400", text: "text-orange-500" },
  Viewed: { border: "border-l-blue-400", dot: "bg-blue-400", text: "text-blue-500" },
  Shortlisted: { border: "border-l-green-400", dot: "bg-green-500", text: "text-green-600" },
  "Not Selected": { border: "border-l-red-400", dot: "bg-red-400", text: "text-red-500" },
};

// Shows ONE application card. Data comes in through props.
type ApplicationCardProps = {
  title: string;
  company: string;
  location: string;
  status: string;
  appliedDate: string;
  interview?: string | null;
  updatedAgo: string;
};

export default function ApplicationCard(props: ApplicationCardProps) {
  const style = statusStyles[props.status];

  return (
    <div className={`bg-white border border-gray-200 border-l-4 ${style.border} rounded-xl p-5`}>
      
      {/* Top row: logo, title, company + 3-dot menu */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">{props.title}</h3>
            <p className="text-sm text-gray-500">
              {props.company} • {props.location}
            </p>
          </div>
        </div>
        <MoreVertical size={16} className="text-gray-400" />
      </div>

      {/* Status + applied date */}
      <div className="flex items-center gap-2 text-sm mb-3">
        <span className={`flex items-center gap-1 font-medium ${style.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {props.status}
        </span>
        <span className="text-gray-400">• Applied: {props.appliedDate}</span>
      </div>

      {/* Only shows if there's an interview scheduled */}
      {props.interview && (
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm rounded-lg px-3 py-2 mb-3">
          <Calendar size={14} />
          <div>
            <p className="font-medium text-xs">Interview Scheduled</p>
            <p className="text-xs">{props.interview}</p>
          </div>
        </div>
      )}

      {/* Bottom row: updated time + action link */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400">Updated {props.updatedAgo}</span>

        {props.status === "Not Selected" ? (
          <button className="flex items-center gap-1 text-sm text-gray-500">
            Archive <Archive size={14} />
          </button>
        ) : (
          <button className="flex items-center gap-1 text-sm text-blue-600 font-medium">
            View Details <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}