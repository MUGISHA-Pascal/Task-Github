"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Task Manager
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

