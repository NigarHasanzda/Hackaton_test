"use client";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-grow mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome</h1>
        <p className="mt-4 text-slate-600">
          This page now includes a header and footer component.
        </p>
      </main>
    </div>
  );
};

export default Page;
