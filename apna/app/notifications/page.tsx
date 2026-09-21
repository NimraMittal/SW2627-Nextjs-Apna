"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Bell, CheckCheck, RefreshCw, Briefcase, Clock } from "lucide-react";

type NotificationItem = {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

function formatTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
  } catch {
    return "Recently";
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNotifications(json.data);
      }
    } catch {
      // offline or error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => loadNotifications());
  }, [loadNotifications]);

  // Connect to SSE for real-time notifications
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource("/api/sse");
      es.onmessage = () => {
        loadNotifications();
      };
    } catch {
      // ignore
    }
    return () => es?.close();
  }, [loadNotifications]);

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="ml-64">
        <Topbar />

        <div className="p-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-500 text-sm mt-1">
                Real-time updates regarding your job applications and employer reviews.
              </p>
            </div>

            <button
              onClick={loadNotifications}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs transition"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          {loading && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-4 h-20 animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <Bell size={36} className="text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">No notifications yet</h3>
              <p className="text-xs text-gray-500">
                You will receive alerts here whenever an employer reviews or updates your applications.
              </p>
            </div>
          )}

          {!loading && notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border rounded-xl p-4 transition-all flex items-start justify-between ${
                    n.isRead
                      ? "bg-white border-gray-200"
                      : "bg-blue-50/60 border-blue-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        n.isRead
                          ? "bg-gray-100 text-gray-500"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          n.isRead ? "text-gray-800" : "font-semibold text-gray-900"
                        }`}
                      >
                        {n.message}
                      </p>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                        <Clock size={11} /> {formatTime(n.createdAt)}
                      </span>
                    </div>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2.5 py-1 rounded-md hover:bg-blue-100/50 flex items-center gap-1 transition"
                      title="Mark as read"
                    >
                      <CheckCheck size={14} /> Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
