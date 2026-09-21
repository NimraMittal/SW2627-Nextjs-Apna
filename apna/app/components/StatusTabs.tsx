"use client";

type StatusTabsProps = {
  activeTab: string;
  onChange: (tab: string) => void;
  counts: {
    all: number;
    pending: number;
    viewed: number;
    shortlisted: number;
    rejected: number;
  };
};

export default function StatusTabs({ activeTab, onChange, counts }: StatusTabsProps) {
  const tabs = [
    { label: "All", value: "ALL", count: counts.all },
    { label: "Pending", value: "PENDING", count: counts.pending },
    { label: "Viewed", value: "VIEWED", count: counts.viewed },
    { label: "Shortlisted", value: "SHORTLISTED", count: counts.shortlisted },
    { label: "Rejected", value: "REJECTED", count: counts.rejected },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={
              isSelected
                ? "bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm px-4 py-1.5 rounded-full transition-colors"
            }
          >
            {tab.label} <span className={`text-xs ml-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>({tab.count})</span>
          </button>
        );
      })}
    </div>
  );
}