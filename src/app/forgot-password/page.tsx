"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { forgotPassword } from "@/services/AuthServices/Password"

const ForgotPasswordPage = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const res = await forgotPassword({ email })

      if (res.succeeded) {
        // backend token emailə göndərir
        // biz user-i reset page-ə yönləndiririk

        router.push(
          `/reset-password?email=${email}`
        )
      } else {
        setError(res.message || "Xəta baş verdi")
      }
    } catch {
      setError("Server xətası")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] p-6 shadow-lg rounded-2xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <button
          className="w-full bg-black text-white p-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Loading..." : "Send"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}

export default ForgotPasswordPage