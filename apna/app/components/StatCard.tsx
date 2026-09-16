import type { LucideIcon } from "lucide-react";

// This component just displays ONE stat box.
// "props" is the data passed in when we use <StatCard ... /> somewhere else.
type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

export default function StatCard(props: StatCardProps) {
  const Icon = props.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <Icon size={20} className="text-blue-600 mb-3" />
      <p className="text-xs text-black mb-1">{props.label.toUpperCase()}</p>
      <p className="text-2xl font-bold">{props.value}</p>
    </div>
  );
}