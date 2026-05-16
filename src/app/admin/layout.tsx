"use client"

import { Geist, Geist_Mono } from "next/font/google"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { usePathname } from "next/navigation"

import "./globals.css"
import Sidebar from "./sidebar"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // Əgər gələcəkdə auth (login/register) səhifələri olarsa, oralarda Sidebar-ın görünməməsi üçün:
  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-[#FDFDFD]">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {/* Autantifikasiya səhifəsi deyilsə, Sidebar-ı göstər */}
          {!isAuthPage && <Sidebar />}

          {/* Sidebar aktiv olduqda sağ tərəfə pl-64 (256px) boşluq veririk */}
          <main className={`flex-1 flex flex-col min-h-screen ${!isAuthPage ? "pl-64" : ""}`}>
            {children}
          </main>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}