"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { GoogleLogin } from "@react-oauth/google"

import {
    loginUser,
    googleLogin,
} from "@/services/AuthServices/AuthServices"

const Page = () => {
    const router = useRouter()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // save user + redirect
    const saveUserAndRedirect = (userData: any) => {
        localStorage.setItem(
            "accessToken",
            userData.accessToken
        )

        localStorage.setItem(
            "refreshToken",
            userData.refreshToken
        )

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        )

        const role = userData.roles?.[0]

        if (role === "Admin") {
            router.push("/admin")
        } else if (role === "Client") {
            router.push("/")
        } else {
            router.push("/unauthorized")
        }
    }
    const handleLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        setLoading(true)
        setError("")

        try {
            const response = await loginUser(formData)

            console.log("LOGIN RESPONSE:", response) // 👈 BURDA

            if (response.succeeded) {
                console.log("USER DATA:", response.data) // 👈 BURDA

                saveUserAndRedirect(response.data)
            } else {
                setError(response.message || "Login xətası")
            }
        } catch (err: any) {
            console.log("LOGIN ERROR:", err) // 👈 BURDA

            setError(
                err?.response?.data?.message ||
                "Email və ya şifrə yanlışdır"
            )
        } finally {
            setLoading(false)
        }
    }

    // GOOGLE LOGIN
    const handleGoogleSuccess = async (
        credentialResponse: any
    ) => {
        try {
            const idToken =
                credentialResponse.credential

            const response = await googleLogin({
                idToken,
            })

            if (response.succeeded) {
                saveUserAndRedirect(response.data)
            } else {
                setError("Google login uğursuz oldu")
            }
        } catch (error) {
            setError("Google login xətası")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-[420px] p-6 rounded-2xl shadow-lg bg-white space-y-4">
                {/* Title */}
                <h1 className="text-3xl font-bold text-center">
                    Login
                </h1>

                {/* FORM */}
                <form
                    onSubmit={handleLogin}
                    className="space-y-4"
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg outline-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-3 rounded-lg"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>

                {/* FORGOT PASSWORD */}
                <p
                    onClick={() =>
                        router.push("/forgot-password")
                    }
                    className="text-center text-sm text-blue-600 cursor-pointer hover:underline"
                >
                    Forgot Password?
                </p>

                {/* GOOGLE LOGIN */}
                <div className="flex justify-center pt-2">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() =>
                            setError("Google login failed")
                        }
                    />
                </div>

                {/* ERROR */}
                {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Page