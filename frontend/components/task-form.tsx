"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader } from "@/components/ui/loader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { Task } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/types"

interface TaskFormProps {
  onSubmit: (task: Task) => void
  onCancel: () => void
  initialData?: Task | null
}

const categories: Category[] = [
  { name: "Work", color: "bg-blue-500" },
  { name: "Personal", color: "bg-green-500" },
  { name: "Health", color: "bg-red-500" },
  { name: "Education", color: "bg-purple-500" },
  { name: "Finance", color: "bg-yellow-500" },
]

export default function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">(initialData?.priority || "")
  const [date, setDate] = useState<Date | undefined>(initialData?.dueDate ? new Date(initialData.dueDate) : undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [category, setCategory] = useState<string>(initialData?.category || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    setIsSubmitting(true)

    const task: Task = {
      id: initialData?.id || Date.now().toString(),
      title,
      description,
      priority: priority as "low" | "medium" | "high" | undefined,
      completed: initialData?.completed || false,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      dueDate: date ? date.toISOString() : undefined,
      completedAt: initialData?.completedAt || null,
      category: category || undefined,
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit(task)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="font-medium"
        />
      </div>

      <div>
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <Select value={priority} onValueChange={(value: "low" | "medium" | "high" | "") => setPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-1/2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Set due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat.name}
              className={`cursor-pointer ${cat.color} ${category === cat.name ? "ring-2 ring-offset-2" : ""}`}
              onClick={() => setCategory(cat.name)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="mr-2" /> : null}
          {initialData ? "Update" : "Create"} Task
        </Button>
      </div>
    </form>
  )
}

