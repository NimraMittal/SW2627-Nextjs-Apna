"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusCircle } from "lucide-react";

const menuItems = [
  { label: "My Jobs", icon: LayoutGrid, href: "/employer" },
  { label: "Post New Job", icon: PlusCircle, href: "/employer/jobs/new" },
];

export default function EmployerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold text-blue-600">Apna</h1>
        <p className="text-xs text-gray-400">EMPLOYER PORTAL</p>
      </div>

      <nav className="px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
                  : "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
              }
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}