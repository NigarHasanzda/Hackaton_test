import { api } from "@/utils/api"

// BASE RESPONSE
export interface BaseResponse {
  succeeded: boolean
  message: string | null
  errors: string[]
}

// FORGOT PASSWORD
export interface ForgotPasswordPayload {
  email: string
}

export const forgotPassword = async (
  data: ForgotPasswordPayload
): Promise<BaseResponse> => {
  const res = await api.post<BaseResponse>(
    "/Auth/forgot-password",
    data
  )

  return res.data
}

// RESET PASSWORD
export interface ResetPasswordPayload {
  email: string
  token: string
  newPassword: string
}

export const resetPassword = async (
  data: ResetPasswordPayload
): Promise<BaseResponse> => {
  const res = await api.post<BaseResponse>(
    "/Auth/reset-password",
    data
  )

  return res.data
}