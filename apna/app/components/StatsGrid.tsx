"use client";

import { useEffect, useState } from "react";
import { FileText, Eye, Star, XCircle } from "lucide-react";

type Stats = {
  total: number;
  pending: number;
  viewed: number;
  shortlisted: number;
  rejected: number;
};

export default function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.data);
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Total Applied",
      value: stats?.total ?? "—",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending",
      value: stats?.pending ?? "—",
      icon: FileText,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Viewed",
      value: stats?.viewed ?? "—",
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Shortlisted",
      value: stats?.shortlisted ?? "—",
      icon: Star,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? "—",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3"
          >
            <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
              <Icon size={18} className={card.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}