import { FileText } from "lucide-react";

// Shows ONE resume in the list. Data comes in through props.
type ResumeCardProps = {
  isPrimary: boolean;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedDate: string;
};

export default function ResumeCard(props: ResumeCardProps) {
  return (
    <div
      className={
        props.isPrimary
          ? "flex items-center justify-between border-2 border-blue-500 rounded-xl p-4"
          : "flex items-center justify-between border border-gray-200 rounded-xl p-4"
      }
    >
      {/* Left side: file icon + name + details */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <FileText size={18} className="text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{props.fileName}</p>
            {/* Only show the "Primary" badge if this is the primary resume */}
            {props.isPrimary && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                Primary
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {props.fileType} • {props.fileSize} • Uploaded {props.uploadedDate}
          </p>
        </div>
      </div>

      {/* Right side: only non-primary resumes get a "Set as Primary" link */}
      {!props.isPrimary && (
        <button className="text-sm text-blue-600 font-medium whitespace-nowrap">
          Set as Primary
        </button>
      )}
    </div>
  );
}