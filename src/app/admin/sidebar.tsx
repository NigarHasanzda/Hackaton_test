"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  LogOut,
  Sparkles
} from "lucide-react"

const Sidebar = () => {
  const pathname = usePathname()

  // İstifadəçi məlumatı (Gələcəkdə context və ya auth state-dən gələcək)
  const user = {
    name: "Nigar Həsənzadə",
    role: "Administrator"
  }

  // İstifadəçinin adının baş hərflərini götürürük (məs: NH)
  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Users
    },
    {
      name: "Roles",
      href: "/admin/role",
      icon: ShieldAlert
    }
  ]

  const handleLogout = () => {
    if (confirm("Sistemdən çıxmaq istədiyinizə əmindiniz?")) {
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
  }

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col justify-between fixed left-0 top-0 z-40 font-sans">
      {/* Top: Brand Header */}
      <div>
        <div className="h-16 border-b border-slate-100 flex items-center px-6 gap-2.5">
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">
            Phantoms Admin
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-black text-white"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                }`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom: User Profile & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 py-1">
          {/* Dinamik adın baş hərflərinə uyğun avatar */}
          <div className="w-9 h-9 rounded-lg bg-slate-200 border border-slate-300/60 flex items-center justify-center text-slate-700 font-bold text-xs tracking-wider shrink-0">
            {userInitials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-900 truncate">
              {user.name}
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors mt-2"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar