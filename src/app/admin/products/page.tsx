"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/AdminServices/ProductServices"
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  Layers, 
  DollarSign, 
  Boxes, 
  Image as ImageIcon,
  Loader2,
  X 
} from "lucide-react"

type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  thumbnailUrl?: string
  isActive?: boolean
}

const ProductsPage = () => {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    thumbnailUrl: "",
  })

  // ================= GET PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await getProducts()
      const productList = res?.items || res?.data?.items || []
      setProducts(productList)
    } catch (err) {
      console.error("GET PRODUCTS ERROR:", err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // ================= INPUT CHANGE =================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }))
  }

  // ================= FORM RESET =================
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      thumbnailUrl: "",
    })
    setEditingId(null)
  }

  // ================= SUBMIT (CREATE OR UPDATE) =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    try {
      setActionLoading(true)

      // 🔥 Swagger sənədləşməsinə uyğun olaraq payload tamamilə yeniləndi
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || "",
        isActive: true // 🔥 Məhsulun aktiv qalması və silinmiş kimi görünməməsi üçün vacibdir
      }

      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }

      resetForm()
      await fetchProducts()
    } catch (err) {
      console.error("SUBMIT ERROR:", err)
    } finally {
      setActionLoading(false)
    }
  }

  // ================= START EDITING =================
  const handleEditClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      category: product.category,
      thumbnailUrl: product.thumbnailUrl || "",
    })
  }

  // ================= DELETE PRODUCT =================
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      setActionLoading(true)
      await deleteProduct(id)
      if (editingId === id) resetForm()
      await fetchProducts()
    } catch (err) {
      console.error("DELETE ERROR:", err)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="p-8 bg-[#FDFDFD] min-h-screen font-sans text-slate-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Package className="w-6 h-6 text-black" />
          Product Catalog
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your store products, pricing, and stock levels.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Create / Edit Form */}
        <div className="xl:col-span-1 bg-white p-6 border border-slate-200 rounded-xl shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] h-fit sticky top-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              {editingId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4" />}
              {editingId ? "Update Product" : "Add New Product"}
            </h2>
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-200 transition-all"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Product Name</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="name" value={form.name} placeholder="iPhone 15 Pro" onChange={handleChange} required
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Description</label>
              <input name="description" value={form.description} placeholder="Product short details..." onChange={handleChange}
                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black p-2.5 rounded-lg text-sm outline-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="price" type="number" value={form.price || ""} placeholder="999" onChange={handleChange} required min="0"
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Stock Qty</label>
                <div className="relative">
                  <Boxes className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="stock" type="number" value={form.stock || ""} placeholder="50" onChange={handleChange} required min="0"
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Category</label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="category" value={form.category} placeholder="Electronics" onChange={handleChange} required
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Thumbnail URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="thumbnailUrl" value={form.thumbnailUrl} placeholder="https://example.com/image.jpg" onChange={handleChange}
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-black pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all" />
              </div>
            </div>

            <button type="submit" disabled={actionLoading}
              className={`w-full text-white font-medium p-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 ${
                editingId ? "bg-amber-600 hover:bg-amber-700" : "bg-black hover:bg-slate-800"
              }`}>
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingId ? (
                <Edit3 className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {editingId ? "Save Changes" : "Add Product"}
            </button>
          </form>
        </div>

        {/* Product List Table Card */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden h-fit">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              <p className="text-slate-400 text-xs font-medium">Fetching products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-slate-400 text-sm">No products found in stock.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr 
                      key={p.id} 
                      onClick={() => router.push(`/admin/products/${p.id}`)}
                      className={`hover:bg-slate-50/60 transition-colors group cursor-pointer ${
                        editingId === p.id ? "bg-amber-50/40 hover:bg-amber-50/60" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-mono text-[10px] uppercase overflow-hidden shrink-0">
                            {p.name.substring(0, 2)}
                          </div>
                          <div className="max-w-[200px] truncate">
                            <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{p.description || "No description"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200/40">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        ${p.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                          <span className="text-sm text-slate-600 font-medium">
                            {p.stock > 0 ? `${p.stock} units` : "Out of Stock"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => handleEditClick(e, p)}
                            disabled={actionLoading}
                            className="p-2 hover:bg-amber-50 rounded-lg text-slate-400 hover:text-amber-600 transition-all"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={(e) => handleDelete(e, p.id)}
                            disabled={actionLoading}
                            className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProductsPage