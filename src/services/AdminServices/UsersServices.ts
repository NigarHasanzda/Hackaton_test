import {
  AssignRoleRequest,
  RemoveRoleRequest,
  UsersResponse,
} from "@/types/Admin/UserTypes"
import { api } from "@/utils/api"

// 🔥 TOKEN HELPER
const getToken = () => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  return JSON.parse(userStr)?.accessToken
}

// USERS LIST
export const getUsers = async (): Promise<UsersResponse> => {
  const token = getToken()

  const res = await api.get("/Admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

// ASSIGN ROLE
export const assignRole = async (data: AssignRoleRequest) => {
  const token = getToken()

  const res = await api.post("/Admin/assign-role", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

// REMOVE ROLE
export const removeRole = async (data: RemoveRoleRequest) => {
  const token = getToken()

  const res = await api.post("/Admin/remove-role", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

// TOGGLE ACTIVE
export const toggleUserActive = async (userId: string) => {
  const token = getToken()

  const res = await api.patch(
    `/Admin/users/${userId}/toggle-active`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}

// DELETE USER
export const deleteUser = async (userId: string) => {
  const token = getToken()

  const res = await api.delete(`/Admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}