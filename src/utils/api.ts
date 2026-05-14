import axios from "axios"

export const api = axios.create({
  baseURL: "https://codephantoms.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")

    if (user) {
      const token = JSON.parse(user)?.accessToken

      if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  }

  return config
})