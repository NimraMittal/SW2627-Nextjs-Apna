"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Search, Bell, LogOut } from "lucide-react";

export default function Topbar() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Candidate";
  const userInitial = userName[0]?.toUpperCase() || "U";

  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
      {/* Search box */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-80">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs, companies, skills..."
          className="bg-transparent outline-none text-sm w-full text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Profile & notifications */}
      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          title="Notifications"
        >
          <Bell size={20} />
        </Link>

        {session ? (
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {userInitial}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-gray-900 leading-tight">
                  {userName}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">
                  {session.user.role}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth" })}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="text-xs font-semibold bg-blue-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}