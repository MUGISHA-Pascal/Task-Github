"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/lib/api"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/lib/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userData = await login({ email, password }).unwrap()
      dispatch(setCredentials(userData))
      router.push("/dashboard")
    } catch (err) {
      console.error("Failed to log in:", err)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

