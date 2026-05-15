"use client"

import React, { useEffect, useState } from "react"
import {
  getRoles,
  createRole,
  addPermissionsToRole,
  removePermissionsFromRole,
  deleteRole,
  getRolePermissions,
} from "../../../services/AdminServices/RoleService"
import { Role, CreateRoleRequest } from "../../../types/Admin/Role"
import { 
  Shield, 
  Plus, 
  Trash2, 
  Eye, 
  Key, 
  X, 
  Layers, 
  Loader2,
  FileText 
} from "lucide-react"

const RoleManagementPage = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [selectedRole, setSelectedRole] = useState("")
  const [permissionInput, setPermissionInput] = useState("")
  const [viewingRoleName, setViewingRoleName] = useState<string | null>(null)
  const [rolePermissions, setRolePermissions] = useState<string[]>([])

  const [formData, setFormData] = useState<CreateRoleRequest>({
    name: "",
    description: "",
    permissions: [],
  })

  // =========================
  // GET ROLES
  // =========================
  const fetchRoles = async () => {
    try {
      setLoading(true)
      const res = await getRoles()
      const data = res?.data ?? res
      setRoles(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("GET ROLES ERROR:", err)
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  // Xüsusi rola aid icazələri yeniləmək üçün köməkçi funksiya
  const refreshCurrentRolePermissions = async (roleName: string) => {
    try {
      const res = await getRolePermissions(roleName)
      setRolePermissions(res?.data ?? res ?? [])
    } catch (err) {
      console.error("REFRESH PERMISSIONS ERROR:", err)
    }
  }

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // =========================
  // CREATE ROLE
  // =========================
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      setActionLoading(true)
      await createRole(formData)
      setFormData({ name: "", description: "", permissions: [] })
      await fetchRoles()
    } catch (err) {
      console.error("CREATE ROLE ERROR:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // =========================
  // DELETE ROLE
  // =========================
  const handleDeleteRole = async (roleName: string) => {
    if (!confirm(`Are you sure you want to delete the "${roleName}" role?`)) return
    try {
      setActionLoading(true)
      await deleteRole(roleName)
      if (viewingRoleName === roleName) {
        setViewingRoleName(null)
        setRolePermissions([])
      }
      await fetchRoles()
    } catch (err) {
      console.error("DELETE ROLE ERROR:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // =========================
  // ADD PERMISSION (FIXED REFRESH)
  // =========================
  const handleAddPermission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !permissionInput.trim()) return

    try {
      setActionLoading(true)
      const freshPermission = permissionInput.trim()
      await addPermissionsToRole(selectedRole, [freshPermission])
      
      setPermissionInput("")
      
      // Həm ümumi siyahını, həm də aktiv baxış pəncərəsini yeniləyirik
      await fetchRoles()
      if (viewingRoleName === selectedRole) {
        await refreshCurrentRolePermissions(selectedRole)
      }
    } catch (err) {
      console.error("ADD PERMISSION ERROR:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // =========================
  // REMOVE PERMISSION (FIXED REFRESH)
  // =========================
  const handleRemovePermission = async (roleName: string, perm: string) => {
    try {
      setActionLoading(true)
      await removePermissionsFromRole(roleName, [perm])
      
      // Avtomatik dataları yenidən çəkirik
      await fetchRoles()
      if (viewingRoleName === roleName) {
        await refreshCurrentRolePermissions(roleName)
      }
    } catch (err) {
      console.error("REMOVE PERMISSION ERROR:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // =========================
  // VIEW ROLE PERMISSIONS
  // =========================
  const handleViewPermissions = async (roleName: string) => {
    try {
      setViewingRoleName(roleName)
      await refreshCurrentRolePermissions(roleName)
    } catch (err) {
      console.error("GET PERMISSIONS ERROR:", err)
    }
  }

  return (
    <div className="p-8 bg-[#FDFDFD] min-h-screen font-sans text-slate-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-black" />
          RBAC Administration
        </h1>
        <p className="text-slate-500 text-sm mt-1">Configure system roles and atomic application permissions.</p>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Create Role Card */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> Create New Role
          </h2>
          <form onSubmit={handleCreateRole} className="space-y-3">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Role Name (e.g., Editor)"
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black p-2.5 rounded-lg text-sm outline-none transition-all"
              required
            />
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short Description"
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black p-2.5 rounded-lg text-sm outline-none transition-all"
            />
            <button 
              disabled={actionLoading || !formData.name.trim()} 
              type="submit"
              className="w-full bg-black hover:bg-slate-800 text-white font-medium p-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create Role
            </button>
          </form>
        </div>

        {/* Assign Permission Card */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <Key className="w-4 h-4" /> Grant Permission to Role
          </h2>
          <form onSubmit={handleAddPermission} className="space-y-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black p-2.5 rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer"
              required
            >
              <option value="">Select Target Role</option>
              {roles.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>

            <input
              value={permissionInput}
              onChange={(e) => setPermissionInput(e.target.value)}
              placeholder="Permission Name (e.g., users:write)"
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black p-2.5 rounded-lg text-sm outline-none transition-all"
              required
            />

            <button
              disabled={actionLoading || !selectedRole || !permissionInput.trim()}
              type="submit"
              className="w-full bg-black hover:bg-slate-800 text-white font-medium p-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Assign Permission
            </button>
          </form>
        </div>
      </div>

      {/* Permissions Detail View */}
      {viewingRoleName && (
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-5 relative animate-in fade-in duration-200">
          <button 
            onClick={() => { setViewingRoleName(null); setRolePermissions([]) }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-slate-500" />
            Permissions for active role: <span className="text-black underline">{viewingRoleName}</span>
          </h3>
          {rolePermissions.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No direct permissions found for this role.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {rolePermissions.map((p, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-md shadow-sm">
                  {p}
                  <button 
                    onClick={() => handleRemovePermission(viewingRoleName, p)}
                    className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Roles Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <p className="text-slate-400 text-xs font-medium">Loading system roles...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">No roles registered in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/4">Role</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">Description</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Embedded Permissions</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {roles.map((role) => (
                  <tr key={role.name} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60 font-mono">
                        {role.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {role.description || <span className="text-slate-300 italic text-xs">No description provided</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xl">
                        {role.permissions && role.permissions.length > 0 ? (
                          role.permissions.map((p, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium rounded">
                              {p}
                              <button
                                onClick={() => handleRemovePermission(role.name, p)}
                                className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleViewPermissions(role.name)}
                          className="p-1.5 hover:bg-slate-100 rounded-md border border-transparent hover:border-slate-200 text-slate-600 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.name)}
                          className="p-1.5 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100 text-red-600 transition-all"
                          title="Delete Role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

export default RoleManagementPage