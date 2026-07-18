"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

interface CurrentUser {
  email: string;
  role: string;
}

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 md:px-6">
      <button onClick={onMenuClick} className="text-slate-400 hover:text-white md:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="ml-auto flex items-center gap-3">
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user.email}</p>
            <p className="text-xs capitalize text-slate-500">{user.role}</p>
          </div>
        )}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
          {user?.email?.[0]?.toUpperCase() ?? "A"}
        </div>
      </div>
    </header>
  );
}