"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmployerSidebar from "../../../components/EmployerSidebar";
import { getCompanyId } from "@/lib/companyId";

export default function NewJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // stops the page from refreshing on submit

    const companyId = getCompanyId();

    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, location, description, companyId }),
    });

    // Send them back to the dashboard once the job is created
    router.push("/employer");
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <EmployerSidebar />

      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
              placeholder="e.g. Remote, or San Francisco, CA"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
              placeholder="What does this role involve?"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}