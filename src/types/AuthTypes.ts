export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  userName: string
  password: string
}

export interface RegisterResponse {
  succeeded: boolean
  message: string | null
  errors: string[]
}

export interface LoginPayload {
  email: string
  password: string
}


export interface LoginResponse {
  succeeded: boolean
  message: string | null
  errors: string[]
  data: {
    accessToken: string
    accessTokenExpiry: string
    email: string
    fullName: string
    refreshToken: string
    roles: string[]
    userId: string
  }
}

export interface GoogleLoginPayload {
  idToken: string
}

export interface GoogleLoginResponse {
  succeeded: boolean
  message: string | null
  errors: string[]
  data: {
    accessToken: string
    accessTokenExpiry: string
    email: string
    fullName: string
    refreshToken: string
    roles: string[]
    userId: string
  }
}