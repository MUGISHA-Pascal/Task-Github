export interface Task {
  id: string
  title: string
  description?: string
  priority?: "low" | "medium" | "high"
  completed: boolean
  createdAt: string
  dueDate?: string
  completedAt: string | null
  category: string
}

export interface Category {
  name: string
  color: string
}

