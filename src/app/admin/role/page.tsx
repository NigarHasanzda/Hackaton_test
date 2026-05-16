"use client"

import React, { useEffect, useState, useRef } from "react"
import {
  getRoles,
  createRole,
  deleteRole,
  getAllPermissions,
  getRolePermissions,
  addPermissionsToRole,
  removePermissionsFromRole,
  PermissionData,
  RoleItem
} from "../../../services/AdminServices/RoleService"
import { 
  Shield, 
  Plus, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  ShieldPlus,
  ChevronDown, 
  X, 
  Loader2,
  Folder,
  Lock
} from "lucide-react"

type Role = {
  id: string
  name: string
}

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissionGroups, setPermissionGroups] = useState<PermissionData>({ Products: [], Users: [], Roles: [] })
  
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [permissionLoading, setPermissionLoading] = useState(false)
  
  // View/Manage Permissions Modu üçün state-lər
  const [viewingRoleName, setViewingRoleName] = useState<string | null>(null)
  const [activeRolePermissions, setActiveRolePermissions] = useState<string[]>([])

  // Form States
  const [roleName, setRoleName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ================= DATA FETCHING =================
  const initPage = async () => {
    try {
      setLoading(true)
      const [rolesData, permsData] = await Promise.all([
        getRoles(),
        getAllPermissions()
      ])
      
      const rolesList = (rolesData as any)?.items || (rolesData as any)?.data || rolesData || []
      setRoles(rolesList)
      setPermissionGroups(permsData)
    } catch (err) {
      console.error("INIT PAGE ERROR:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initPage()

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ================= DROPDOWN TOGGLE PERMISSION =================
  const handleTogglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  // ================= RESET FORM / BACK TO CREATE =================
  const resetForm = () => {
    setRoleName("")
    setSelectedPermissions([])
    setViewingRoleName(null)
    setActiveRolePermissions([])
    setIsDropdownOpen(false)
  }

  // ================= VIEW ROLE PERMISSIONS (VIEW MODE) =================
  const handleViewPermissionsClick = async (role: Role) => {
    if (role.name.toLowerCase() === "admin") return
    try {
      setPermissionLoading(true)
      setViewingRoleName(role.name)
      setSelectedPermissions([]) // dropdown seçimini sıfırlayırıq
      
      const res = await getRolePermissions(role.name)
      const rolePerms: string[] = Array.isArray(res) ? res : (res as any)?.items || (res as any)?.data || []
      
      setActiveRolePermissions(rolePerms)
    } catch (err) {
      console.error("FETCH ROLE PERMISSIONS ERROR:", err)
    } finally {
      setPermissionLoading(false)
    }
  }

  // ================= SINGLE PERMISSION DELETE FROM ROLE =================
  const handleDeletePermissionFromRole = async (permToDelete: string) => {
    if (!viewingRoleName) return
    if (!confirm(`Are you sure you want to remove "${permToDelete}" permission from this role?`)) return

    try {
      setActionLoading(true)
      await removePermissionsFromRole(viewingRoleName, [permToDelete])
      
      // Siyahını dərhal yeniləyirik
      setActiveRolePermissions((prev) => prev.filter((p) => p !== permToDelete))
    } catch (err) {
      console.error("REMOVE PERMISSION ERROR:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // ================= SUBMIT (CREATE ROLE OR ADD PERMISSIONS) =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setActionLoading(true)

      if (viewingRoleName) {
        // Mövcud rola yeni seçilən permission-ları əlavə et (POST /api/Roles/{roleName}/permissions)
        if (selectedPermissions.length > 0) {
          await addPermissionsToRole(viewingRoleName, selectedPermissions)
          
          // Aktiv permission siyahısını yenilə və formu təmizlə
          setActiveRolePermissions((prev) => [...prev, ...selectedPermissions])
          setSelectedPermissions([])
          setIsDropdownOpen(false)
        }
      } else {
        // Tamamilə yeni rol yarat (POST /api/Roles)
        if (!roleName.trim()) return
        const currentName = roleName.trim()
        
        await createRole({ name: currentName })
        
        // Əgər yaradılarkən dropdown-dan permission seçilibsə, onları da göndər
        if (selectedPermissions.length > 0) {
          await addPermissionsToRole(currentName, selectedPermissions)
        }
        
        resetForm()
        await initPage()
      }
    } catch (err) {
      console.error("ROLE SUBMIT ERROR:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // ================= DELETE ROLE =================
  const handleDeleteRole = async (name: string) => {
    if (name.toLowerCase() === "admin") return
    if (!confirm(`Are you sure you want to delete "${name}" role?`)) return
    try {
      setActionLoading(true)
      await deleteRole(name)
      if (viewingRoleName === name) resetForm()
      await initPage()
    } catch (err) {
      console.error("DELETE ROLE ERROR:", err)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="p-8 bg-[#FDFDFD] min-h-screen font-sans text-slate-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-black" />
          Access Control (Roles)
        </h1>
        <p className="text-slate-500 text-sm mt-1">Create operational roles and manage assigned API permissions dynamically.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Dynamic Form / Permissions Management Card */}
        <div className="xl:col-span-1 bg-white p-6 border border-slate-200 rounded-xl shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] h-fit sticky top-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              {viewingRoleName ? <Lock className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4" />}
              {viewingRoleName ? "Manage Role Permissions" : "Create New Role"}
            </h2>
            {viewingRoleName && (
              <button type="button" onClick={resetForm} className="text-xs flex items-center gap-1 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-200 transition-all">
                <X className="w-3 h-3" /> Back to Create
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Conditional input display based on active Mode */}
            {!viewingRoleName ? (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Role Name</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={roleName} placeholder="e.g., Manager" onChange={(e) => setRoleName(e.target.value)} required
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all" />
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Active Role</span>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {viewingRoleName}
                </span>
                
                {/* Active Permissions List inside the viewing role */}
                <div className="mt-3 border-t border-slate-200 pt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Assigned Permissions:</span>
                  {permissionLoading ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 py-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching permissions...
                    </div>
                  ) : activeRolePermissions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-1">No permissions assigned yet.</p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      {activeRolePermissions.map((perm) => (
                        <div key={perm} className="flex items-center justify-between bg-white border border-slate-100 rounded-md pl-2.5 pr-1.5 py-1 text-xs text-slate-700 hover:border-slate-200 transition-colors">
                          <span className="font-mono text-[11px] text-slate-600 truncate mr-2">{perm}</span>
                          <button type="button" onClick={() => handleDeletePermissionFromRole(perm)} disabled={actionLoading}
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GROUPED MULTI-SELECT DROPDOWN */}
            <div className="space-y-1 relative" ref={dropdownRef}>
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
                {viewingRoleName ? "Grant New Permissions" : "Initial Permissions (Optional)"}
              </label>
              
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full min-h-[42px] bg-slate-50 ring-1 ring-slate-200 rounded-lg p-2 flex items-center justify-between gap-2 cursor-pointer text-sm hover:ring-slate-300 transition-all"
              >
                {selectedPermissions.length === 0 ? (
                  <span className="text-slate-400 pl-2">Select permissions to add...</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selectedPermissions.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1 bg-black text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                        {p.split(".").pop()}
                        <X className="w-3 h-3 cursor-pointer hover:text-red-300" onClick={(e) => { e.stopPropagation(); handleTogglePermission(p) }} />
                      </span>
                    ))}
                  </div>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 mr-1 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {/* Dropdown Menu Items */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50 p-2 space-y-3">
                  {Object.entries(permissionGroups).map(([groupName, perms]) => {
                    // Əgər rol daxilində artıq olan permission-lar varsa onları dropdown-da gizlədə və ya fərqləndirə bilərik
                    if (!perms || perms.length === 0) return null;
                    return (
                      <div key={groupName} className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 bg-slate-50 rounded flex items-center gap-1">
                          <Folder className="w-3 h-3" /> {groupName}
                        </div>
                        
                        <div className="space-y-0.5 pl-1">
                          {perms.map((perm: string) => {
                            // Rolun artıq sahib olduğu permission dropdown-da seçilməsin
                            const alreadyHas = activeRolePermissions.includes(perm)
                            const isSelected = selectedPermissions.includes(perm)
                            
                            return (
                              <div
                                key={perm}
                                onClick={() => !alreadyHas && handleTogglePermission(perm)}
                                className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                                  alreadyHas ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400" :
                                  isSelected ? "bg-slate-950 text-white font-medium cursor-pointer" : "hover:bg-slate-50 text-slate-700 cursor-pointer"
                                }`}
                              >
                                <span className={alreadyHas ? "line-through" : ""}>{perm}</span>
                                {alreadyHas ? (
                                  <span className="text-[9px] font-medium text-slate-400 px-1">Assigned</span>
                                ) : isSelected ? (
                                  <span className="text-[9px] bg-white/20 text-white px-1 py-0.2 rounded">To Add</span>
                                ) : null}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <button type="submit" disabled={actionLoading || (viewingRoleName && selectedPermissions.length === 0)}
              className={`w-full text-white font-medium p-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                viewingRoleName ? "bg-amber-600 hover:bg-amber-700" : "bg-black hover:bg-slate-800"
              }`}>
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : viewingRoleName ? (
                <Plus className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {viewingRoleName ? "Grant Selected Permissions" : "Create Role"}
            </button>
          </form>
        </div>

        {/* Roles List Table */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden h-fit">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              <p className="text-slate-400 text-xs font-medium">Fetching roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-slate-400 text-sm">No roles registered in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {roles.map((r) => (
                    <tr key={r.id || r.name} className={`hover:bg-slate-50/60 transition-colors group ${viewingRoleName === r.name ? "bg-amber-50/30" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs uppercase shrink-0">
                            {r.name.substring(0, 2)}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {r.name.toLowerCase() === "admin" ? (
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 italic px-2">
                              <Lock className="w-3 h-3" /> Protected
                            </span>
                          ) : (
                            <>
                              {/* VIEW PERMISSIONS BUTTON */}
                              <button onClick={() => handleViewPermissionsClick(r)} disabled={actionLoading}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-black transition-all" title="View Permissions">
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* ASSIGN PERMISSIONS BUTTON */}
                              <button onClick={() => handleViewPermissionsClick(r)} disabled={actionLoading}
                                className="p-2 hover:bg-amber-50 rounded-lg text-slate-400 hover:text-amber-600 transition-all" title="Assign Permissions">
                                <ShieldPlus className="w-4 h-4" />
                              </button>

                              {/* DELETE ROLE BUTTON */}
                              <button onClick={() => handleDeleteRole(r.name)} disabled={actionLoading}
                                className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all" title="Delete Role">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
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
    </div>
  )
}

export default RolesPage