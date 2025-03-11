import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <h1 className="text-4xl font-bold mb-6">Welcome to Task Manager</h1>
      <p className="text-xl mb-8">Manage your tasks efficiently with our GitHub-style contribution graph.</p>
      <div className="space-x-4">
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
        {/* Commented out authentication-related buttons
        <Link href="/login">
          <Button size="lg">Login</Button>
        </Link>
        <Link href="/register">
          <Button size="lg" variant="outline">Register</Button>
        </Link>
        */}
      </div>
    </div>
  )
}

