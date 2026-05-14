"use client"

import { registerUser } from "@/services/AuthServices/AuthServices"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2, AlertCircle, X } from "lucide-react"

const Register = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | null }>({
    message: "",
    type: null,
  })

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: null }), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setToast({ message: "", type: null })

    try {
      const response = await registerUser(formData)

      if (response.succeeded) {
        setToast({ message: "Registration successful! Redirecting...", type: "success" })
        
        setFormData({ firstName: "", lastName: "", email: "", userName: "", password: "" })

        setTimeout(() => {
          router.push("/login")
        }, 2500)
      } else {
        setToast({ message: response.errors[0] || "Registration failed", type: "error" })
      }
    } catch (error: any) {
      setToast({ 
        message: error?.response?.data?.errors?.[0] || "An unexpected error occurred", 
        type: "error" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 font-sans text-[#111827]">
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-0 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[320px] border ${
              toast.type === "success" 
                ? "bg-white border-green-100 text-green-800" 
                : "bg-white border-red-100 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => setToast({ message: "", type: null })}>
              <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black p-3 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black p-3 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black p-3 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Username</label>
            <input
              type="text"
              name="userName"
              required
              value={formData.userName}
              onChange={handleChange}
              placeholder="johndoe123"
              className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black p-3 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black p-3 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111827] hover:bg-black text-white font-medium p-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <button 
            onClick={() => router.push("/login")}
            className="text-black font-semibold hover:underline underline-offset-4"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  )
}

export default Register