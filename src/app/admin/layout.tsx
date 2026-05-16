"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { usePathname } from "next/navigation"

import Sidebar from "./sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // Əgər gələcəkdə auth (login/register) səhifələri olarsa, oralarda Sidebar-ın görünməməsi üçün:
  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="min-h-full flex bg-[#FDFDFD]">
        {/* Autantifikasiya səhifəsi deyilsə, Sidebar-ı göstər */}
        {!isAuthPage && <Sidebar />}

        {/* Sidebar aktiv olduqda sağ tərəfə pl-64 (256px) boşluq veririk */}
        <main className={`flex-1 flex flex-col min-h-screen ${!isAuthPage ? "pl-64" : ""}`}>
          {children}
        </main>
      </div>
    </GoogleOAuthProvider>
  )
}