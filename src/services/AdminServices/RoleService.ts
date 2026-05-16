import { api } from "@/utils/api"

export interface CreateRoleRequest {
  name: string
}

export interface RoleItem {
  id: string
  name: string
}

export interface RolesResponse {
  items: RoleItem[]
  data?: RoleItem[]
  totalCount?: number
}

export interface PermissionData {
  Products: string[]
  Users: string[]
  Roles: string[]
  [key: string]: string[]
}

const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  if (!user) return null
  try {
    return JSON.parse(user)?.accessToken || null
  } catch (error) {
    return null
  }
}

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
})

// GET /api/Roles
export const getRoles = async (): Promise<RolesResponse> => {
  const res = await api.get("/Roles", { headers: authHeader() })
  return res.data
}

// POST /api/Roles
export const createRole = async (data: CreateRoleRequest): Promise<any> => {
  const res = await api.post("/Roles", data, { headers: authHeader() })
  return res.data
}

// POST /api/Roles/{roleName}/permissions
export const addPermissionsToRole = async (roleName: string, permissions: string[]): Promise<any> => {
  const res = await api.post(`/Roles/${roleName}/permissions`, permissions, { headers: authHeader() })
  return res.data
}

// DELETE /api/Roles/{roleName}/permissions
export const removePermissionsFromRole = async (roleName: string, permissions: string[]): Promise<any> => {
  const res = await api.delete(`/Roles/${roleName}/permissions`, {
    headers: authHeader(),
    data: permissions,
  })
  return res.data
}

// GET /api/Roles/{roleName}/permissions
export const getRolePermissions = async (roleName: string): Promise<string[]> => {
  const res = await api.get(`/Roles/${roleName}/permissions`, { headers: authHeader() })
  return res.data?.items || res.data?.data || res.data || []
}

// DELETE /api/Roles/{roleName}
export const deleteRole = async (roleName: string): Promise<any> => {
  const res = await api.delete(`/Roles/${roleName}`, { headers: authHeader() })
  return res.data
}

// GET /api/Roles/permissions
export const getAllPermissions = async (): Promise<PermissionData> => {
  const res = await api.get("/Roles/permissions", { headers: authHeader() })
  return res.data?.data || res.data || { Products: [], Users: [], Roles: [] }
}