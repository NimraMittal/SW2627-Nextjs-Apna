import { UploadCloud, Info } from "lucide-react";

export default function ResumeUploadBox() {
  return (
    <div>
      <h2 className="font-semibold text-gray-900 mb-3">Add New Resume</h2>

      {/* Dashed drag-and-drop box */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center py-10 px-6">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <UploadCloud size={22} className="text-blue-600" />
        </div>
        <p className="font-semibold text-gray-900 mb-1">Drag & drop your file here</p>
        <p className="text-sm text-gray-400 mb-4">
          Support for PDF, DOC, DOCX up to 5MB.
        </p>
        <button className="bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg">
          Browse Files
        </button>
      </div>

      {/* Pro tip box */}
      <div className="flex gap-2 bg-blue-50 text-sm text-blue-800 rounded-lg p-3 mt-4">
        <Info size={16} className="shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Pro Tip:</span> Tailor your resume for
          specific job applications. You can maintain multiple versions and select
          the most relevant one when applying.
        </p>
      </div>
    </div>
  );
}