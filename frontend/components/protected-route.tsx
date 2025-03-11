"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/lib/authSlice"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector(selectCurrentUser)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return <>{children}</>
}

