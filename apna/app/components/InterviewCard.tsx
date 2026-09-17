import { Calendar, Clock, Video } from "lucide-react";

// Displays ONE interview card. Data comes in through props.
type InterviewCardProps = {
  initial: string;
  role: string;
  company: string;
  date: string;
  time: string;
  platform: string;
};

export default function InterviewCard(props: InterviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      
      {/* Logo circle + job title */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center font-semibold">
          {props.initial}
        </div>
        <div>
          <p className="font-semibold text-sm">{props.role}</p>
          <p className="text-xs text-gray-500">{props.company}</p>
        </div>
      </div>

      {/* Date / Time / Platform */}
      <div className="text-sm text-black space-y-1 mb-4">
        <p className="flex items-center gap-2">
          <Calendar size={14} /> {props.date}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={14} /> {props.time}
        </p>
        <p className="flex items-center gap-2">
          <Video size={14} /> {props.platform}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg">
          Join Call
        </button>
        <button className="flex-1 border border-gray-200 text-sm py-2 rounded-lg">
          Details
        </button>
      </div>
    </div>
  );
}