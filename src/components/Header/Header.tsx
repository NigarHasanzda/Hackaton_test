"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold text-slate-900">My App</div>
        <nav className="flex gap-6 text-sm text-slate-600">
          <Link href="/">Home</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
