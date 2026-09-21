"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutGrid, PlusCircle, ArrowLeftRight, LogOut, LogIn } from "lucide-react";

const menuItems = [
  { label: "My Jobs", icon: LayoutGrid, href: "/employer" },
  { label: "Post New Job", icon: PlusCircle, href: "/employer/jobs/new" },
];

export default function EmployerSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col justify-between">
      <div>
        <div className="px-6 py-6">
          <h1 className="text-xl font-bold text-blue-600">Apna</h1>
          <p className="text-xs text-gray-400 font-semibold tracking-wider">EMPLOYER PORTAL</p>
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
                    ? "flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-xs"
                    : "flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium transition-colors"
                }
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-colors"
        >
          <ArrowLeftRight size={13} /> Switch to Candidate Portal
        </Link>

        {session ? (
          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <div className="truncate max-w-[130px]">
              <span className="font-semibold text-gray-800 block truncate">{session.user.name}</span>
              <span className="text-gray-400 text-[10px] block">Employer</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth" })}
              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors"
          >
            <LogIn size={13} /> Employer Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}