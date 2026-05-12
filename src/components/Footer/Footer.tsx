"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} My App. All rights reserved.
      </div>
    </footer>
  );
}
