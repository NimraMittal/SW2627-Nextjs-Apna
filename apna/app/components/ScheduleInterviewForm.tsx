"use client";

import { useState } from "react";

// props.applicationId tells us WHICH application to attach the interview to
// props.onScheduled runs after a successful save, so the parent page can refresh
type ScheduleInterviewFormProps = {
  applicationId: string;
  onScheduled: () => void;
};

export default function ScheduleInterviewForm(props: ScheduleInterviewFormProps) {
  const [dateTime, setDateTime] = useState("");
  const [platform, setPlatform] = useState("Google Meet");
  const [saving, setSaving] = useState(false);

  async function handleSchedule() {
    setSaving(true);

    await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: props.applicationId,
        scheduledAt: dateTime,
        platform,
      }),
    });

    setSaving(false);
    props.onScheduled();
  }

  return (
    <div className="bg-blue-50 rounded-lg p-3 mt-3 space-y-2">
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5"
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5"
      >
        <option>Google Meet</option>
        <option>Teams Link</option>
        <option>Zoom</option>
      </select>

      <button
        onClick={handleSchedule}
        disabled={!dateTime || saving}
        className="w-full bg-blue-700 text-white text-sm font-medium py-1.5 rounded-lg disabled:opacity-50"
      >
        {saving ? "Scheduling..." : "Confirm Interview"}
      </button>
    </div>
  );
}