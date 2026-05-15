"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getProductById } from "@/services/AdminServices/ProductServices"


type ProductImage = {
  id: string
  url: string
  altText: string | null
  displayOrder: number
}

type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  thumbnailUrl: string
  images: ProductImage[]
  isActive: boolean
  createdAt: string
  createdBy: string
}

const Page = () => {
  const params = useParams()

  const id = params?.id as string

  const [product, setProduct] =
    useState<Product | null>(null)

  const [loading, setLoading] =
    useState(false)

  // ================= GET DETAIL =================
  const fetchProduct = async () => {
    if (!id) return

    try {
      setLoading(true)

      const res = await getProductById(id)

      console.log("DETAIL RESPONSE:", res)

      // backend:
      // { succeeded, message, data }

      setProduct(res?.data ?? null)
    } catch (err) {
      console.log("DETAIL ERROR:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  // ================= LOADING =================
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading...</h2>
      </div>
    )
  }

  // ================= NOT FOUND =================
  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Product not found</h2>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          marginBottom: 20,
        }}
      >
        Product Detail
      </h1>

      {/* THUMBNAIL */}
      <div
        style={{
          marginBottom: 30,
        }}
      >
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          width={350}
          height={350}
          style={{
            objectFit: "cover",
            borderRadius: 12,
          }}
        />
      </div>

      {/* PRODUCT INFO */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 40,
        }}
      >
        <p>
          <strong>ID:</strong> {product.id}
        </p>

        <p>
          <strong>Name:</strong> {product.name}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {product.description}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {product.category}
        </p>

        <p>
          <strong>Price:</strong> $
          {product.price}
        </p>

        <p>
          <strong>Stock:</strong>{" "}
          {product.stock}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {product.isActive
            ? "Active"
            : "Inactive"}
        </p>

        <p>
          <strong>Created By:</strong>{" "}
          {product.createdBy}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(
            product.createdAt
          ).toLocaleString()}
        </p>
      </div>

      {/* IMAGES */}
      <div>
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Product Images
        </h2>

        {product.images?.length === 0 ? (
          <p>No images found</p>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {product.images.map((img) => (
              <div
                key={img.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 10,
                  width: 220,
                }}
              >
                <img
                  src={img.url}
                  alt={
                    img.altText || "product image"
                  }
                  width={200}
                  height={200}
                  style={{
                    objectFit: "cover",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                />

                <p>
                  <strong>Image ID:</strong>{" "}
                  {img.id}
                </p>

                <p>
                  <strong>Alt Text:</strong>{" "}
                  {img.altText || "No alt text"}
                </p>

                <p>
                  <strong>Display Order:</strong>{" "}
                  {img.displayOrder}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page