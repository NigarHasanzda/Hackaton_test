import { GoogleLoginPayload, GoogleLoginResponse, LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/types/AuthTypes"
import { api } from "@/utils/api"


export const registerUser = async (
  data: RegisterPayload
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    "/Auth/register",
    data
  )

  return response.data
}


export const loginUser = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/Auth/login",
    data
  )

  return response.data
}

export const googleLogin = async (
  data: GoogleLoginPayload
): Promise<GoogleLoginResponse> => {
  const response = await api.post<GoogleLoginResponse>(
    "/Auth/google-signin",
    data
  )

  return response.data
}