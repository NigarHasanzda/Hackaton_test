"use client"

import React, { useEffect, useState } from "react"
import {
  getUsers,
  assignRole,
  removeRole,
  toggleUserActive,
  deleteUser,
} from "../../services/AdminServices/UsersServices"
import { User } from "../../types/Admin/UserTypes"
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserMinus, 
  UserCheck, 
  Trash2, 
  MoreVertical,
  Search,
  RefreshCw,
  Lock
} from "lucide-react"

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await getUsers()
      setUsers(res?.data || [])
    } catch (err) {
      console.error("Users error:", err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAction = async (userId: string, actionFn: () => Promise<any>) => {
    setActionLoading(userId)
    try {
      await actionFn()
      await fetchUsers()
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="p-8 bg-[#FDFDFD] min-h-screen font-sans text-slate-900">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage system roles, permissions, and account statuses.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all w-full md:w-64"
            />
          </div>
          <button 
            onClick={fetchUsers}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-[20px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-black rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Fetching users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-500">No users found in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Roles</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                          {u.fullName?.charAt(0) || u.email.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{u.fullName}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">@{u.userName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        u.isActive 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                          : "bg-slate-100 border-slate-200 text-slate-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles?.map((role) => (
                          <span key={role} className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[11px] font-bold tracking-tight">
                            {role.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.roles?.some((r) => r.toLowerCase() === "admin") ? (
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 italic px-2">
                            <Lock className="w-3 h-3" /> Protected
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleAction(u.id, () => toggleUserActive(u.id))}
                            disabled={actionLoading === u.id}
                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-600 tooltip"
                            title="Toggle Status"
                          >
                            {u.isActive ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          <button 
                            onClick={() => handleAction(u.id, () => assignRole({ userId: u.id, roleName: "Admin" }))}
                            disabled={actionLoading === u.id}
                            className="p-2 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition-all text-blue-600"
                            title="Make Admin"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={() => handleAction(u.id, () => removeRole({ userId: u.id, roleName: "Admin" }))}
                            disabled={actionLoading === u.id}
                            className="p-2 hover:bg-orange-50 rounded-lg border border-transparent hover:border-orange-100 transition-all text-orange-600"
                            title="Remove Admin"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>

                          <div className="w-px h-4 bg-slate-200 mx-1" />

                          <button 
                            onClick={() => handleAction(u.id, () => deleteUser(u.id))}
                            disabled={actionLoading === u.id}
                            className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all text-red-600"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersPage