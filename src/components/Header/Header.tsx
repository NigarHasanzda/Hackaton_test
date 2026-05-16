"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };
    check();

    // keep in sync when storage changes (e.g. login/logout in another tab)
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold text-slate-900">My App</div>
        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <Link href="/">Home</Link>
          <Link href="/contact">Contact</Link>
          {isLoggedIn && <Link href="/admin">Admin</Link>}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
