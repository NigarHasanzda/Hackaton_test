"use client"

import { useEffect, useState } from "react"
import { getProducts } from "../services/AdminServices/ProductServices"
import { ShoppingCart, Tag, Boxes, Loader2 } from "lucide-react"

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

const Page = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await getProducts()
        const list = res?.items || res?.data?.items || []
        setProducts(list)
      } catch (err) {
        console.error("GET PRODUCTS ERROR:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-1">Browse all available products.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
            <p className="text-slate-400 text-sm">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center text-slate-400 text-sm">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-shadow flex flex-col"
              >
                {/* Thumbnail */}
                <div className="w-full h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                  {p.thumbnailUrl ? (
                    <img
                      src={p.thumbnailUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingCart className="w-10 h-10 text-slate-300" />
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h2 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{p.name}</h2>

                  {p.category && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 w-fit font-medium">
                      <Tag className="w-3 h-3" /> {p.category}
                    </span>
                  )}

                  <p className="text-xs text-slate-500 line-clamp-2 flex-1">{p.description}</p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-bold text-slate-900">${p.price.toFixed(2)}</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Boxes className="w-3.5 h-3.5" /> {p.stock} in stock
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Page
