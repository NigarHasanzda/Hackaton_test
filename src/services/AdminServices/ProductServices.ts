import { api } from "@/utils/api"

// ================= TOKEN =================
const getToken = () => {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem("user")
  if (!user) return null

  return JSON.parse(user)?.accessToken
}

// ================= AUTH HEADER =================
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
})

// ================= GET PRODUCTS =================
export const getProducts = async (
  page = 1,
  pageSize = 10,
  category?: string
) => {
  const res = await api.get("/Products", {
    headers: authHeader(),
    params: {
      page,
      pageSize,
      category,
    },
  })

  return res.data
}

// ================= GET PRODUCT BY ID =================
export const getProductById = async (id: string) => {
  const res = await api.get(`/Products/${id}`, {
    headers: authHeader(),
  })

  return res.data
}

// ================= CREATE PRODUCT =================
export const createProduct = async (data: any) => {
  const res = await api.post("/Products", data, {
    headers: authHeader(),
  })

  return res.data
}

// ================= UPDATE PRODUCT =================
export const updateProduct = async (id: string, data: any) => {
  const res = await api.put(`/Products/${id}`, data, {
    headers: authHeader(),
  })

  return res.data
}

// ================= DELETE PRODUCT =================
export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/Products/${id}`, {
    headers: authHeader(),
  })

  return res.data
}