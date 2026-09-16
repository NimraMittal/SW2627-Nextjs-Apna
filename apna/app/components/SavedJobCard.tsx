import { MapPin, Briefcase, Clock } from "lucide-react";

// Shows ONE saved job card. Data comes in through props.
type SavedJobCardProps = {
  title: string;
  company: string;
  location: string;
  salary: string;
  savedAgo: string;
};

export default function SavedJobCard(props: SavedJobCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      
      {/* Logo placeholder + title + company */}
      <div className="flex gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
        <div>
          <h3 className="font-semibold text-gray-900">{props.title}</h3>
          <p className="text-sm text-blue-600">{props.company}</p>
        </div>
      </div>

      {/* Location, salary, saved time */}
      <div className="text-sm text-gray-500 space-y-1.5 mb-4">
        <p className="flex items-center gap-2">
          <MapPin size={14} /> {props.location}
        </p>
        <p className="flex items-center gap-2">
          <Briefcase size={14} /> {props.salary}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={14} /> Saved {props.savedAgo}
        </p>
      </div>

      {/* Apply button */}
      <button className="w-full bg-blue-700 text-white text-sm font-medium py-2 rounded-lg">
        Apply Now
      </button>
    </div>
  );
}