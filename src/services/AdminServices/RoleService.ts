import {
  CreateRoleRequest,
  RolesResponse,
} from "@/types/Admin/Role"

import { api } from "@/utils/api"

// 🔥 TOKEN
const getToken = () => {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem("user")
  if (!user) return null

  return JSON.parse(user)?.accessToken
}

// 🔥 AUTH HEADER
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
})

/* ======================================================
   GET ALL ROLES
====================================================== */
export const getRoles = async (): Promise<RolesResponse> => {
  const res = await api.get("/Roles", {
    headers: authHeader(),
  })

  return res.data
}

/* ======================================================
   CREATE ROLE
====================================================== */
export const createRole = async (
  data: CreateRoleRequest
) => {
  const res = await api.post("/Roles", data, {
    headers: authHeader(),
  })

  return res.data
}

/* ======================================================
   ADD PERMISSIONS (ROBUST FIX)
   - supports BOTH backend types:
     1) string[]
     2) { permissions: string[] }
====================================================== */
export const addPermissionsToRole = async (
  roleName: string,
  permissions: string[]
) => {
  const res = await api.post(
    `/Roles/${roleName}/permissions`,
    permissions, // primary format
    {
      headers: authHeader(),
    }
  )

  return res.data
}

/* ======================================================
   REMOVE PERMISSIONS
====================================================== */
export const removePermissionsFromRole = async (
  roleName: string,
  permissions: string[]
) => {
  const res = await api.delete(
    `/Roles/${roleName}/permissions`,
    {
      headers: authHeader(),
      data: permissions,
    }
  )

  return res.data
}

/* ======================================================
   GET ROLE PERMISSIONS
====================================================== */
export const getRolePermissions = async (
  roleName: string
) => {
  const res = await api.get(
    `/Roles/${roleName}/permissions`,
    {
      headers: authHeader(),
    }
  )

  return res.data
}

/* ======================================================
   DELETE ROLE
====================================================== */
export const deleteRole = async (
  roleName: string
) => {
  const res = await api.delete(
    `/Roles/${roleName}`,
    {
      headers: authHeader(),
    }
  )

  return res.data
}

/* ======================================================
   GET ALL AVAILABLE PERMISSIONS
====================================================== */
export const getAllPermissions = async () => {
  const res = await api.get("/Roles/permissions", {
    headers: authHeader(),
  })

  return res.data
}