export interface Role {
  id?: string
  name: string
  description: string
  permissions: string[]
}

export interface RolesResponse {
  succeeded: boolean
  data: Role[]
  message?: string | null
  errors?: string[]
}

export interface CreateRoleRequest {
  name: string
  description: string
  permissions: string[]
}