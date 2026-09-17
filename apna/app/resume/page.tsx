import Sidebar from "../components/Sidebar";
import ResumeCard from "../components/ResumeCard";
import ResumeUploadBox from "../components/ResumeUploadBox";
import { Search, Bell } from "lucide-react";

// The resumes data — replace with real data later
const resumes = [
  {
    fileName: "Software_Engineer_Resume_2024.pdf",
    fileType: "PDF",
    fileSize: "1.2 MB",
    uploadedDate: "Oct 24, 2023",
    isPrimary: true,
  },
  {
    fileName: "Frontend_Dev_Variant.docx",
    fileType: "DOCX",
    fileSize: "845 KB",
    uploadedDate: "Sep 12, 2023",
    isPrimary: false,
  },
  {
    fileName: "Old_Resume_2022.pdf",
    fileType: "PDF",
    fileSize: "1.5 MB",
    uploadedDate: "Jan 05, 2023",
    isPrimary: false,
  },
];

export default function ResumePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="ml-64">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-80">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search cmd+k"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-500" />
            <div className="w-8 h-8 rounded-full bg-gray-300" />
          </div>
        </div>

        <div className="p-8">
          {/* Page heading */}
          <h1 className="text-2xl font-bold text-gray-900">Resume Management</h1>
          <p className="text-gray-500 text-sm mb-6">
            Manage and organize your professional documents.
          </p>

          {/* Two columns: resumes list (left) + upload box (right) */}
          <div className="grid grid-cols-3 gap-8">
            
            {/* Left: takes up 2 of 3 columns */}
            <div className="col-span-2">
              <h2 className="font-semibold text-gray-900 mb-3">My Resumes</h2>
              <div className="space-y-3">
                {resumes.map((resume, index) => (
                  <ResumeCard
                    key={index}
                    fileName={resume.fileName}
                    fileType={resume.fileType}
                    fileSize={resume.fileSize}
                    uploadedDate={resume.uploadedDate}
                    isPrimary={resume.isPrimary}
                  />
                ))}
              </div>
            </div>

            {/* Right: takes up 1 of 3 columns */}
            <div>
              <ResumeUploadBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}