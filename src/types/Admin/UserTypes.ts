export interface AssignRoleRequest {
  userId: string
  roleName: string
}

export interface RemoveRoleRequest {
  userId: string
  roleName: string
}

export interface User {
  id: string
  email: string
  userName?: string,
  fullName?: string,
  isActive: boolean
  roles: string[]
}

export interface UsersResponse {
  succeeded: boolean
  data: User[]
  message?: string | null
  errors?: string[]
}