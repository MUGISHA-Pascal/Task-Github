"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import ContributionGraph from "@/components/contribution-graph"
import { Loader } from "@/components/ui/loader"
import type { Task } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { TaskStatistics } from "@/components/task-statistics"
import { ConfettiCelebration } from "@/components/confetti-celebration"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const savedTasks = localStorage.getItem("tasks")
        setTasks(savedTasks ? JSON.parse(savedTasks) : [])
        setIsLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    setTasks([...tasks, newTask])
    setIsFormOpen(false)
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleToggleTaskCompletion = (task: Task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null,
    }
    setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)))

    if (!task.completed) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000) // Hide confetti after 5 seconds
    }
  }

  const startEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader className="h-8 w-8" />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Tasks</h2>
            <Button
              onClick={() => {
                setEditingTask(null)
                setIsFormOpen(true)
              }}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {isFormOpen && (
            <Card className="p-4">
              <TaskForm
                onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                onCancel={() => {
                  setIsFormOpen(false)
                  setEditingTask(null)
                }}
                initialData={editingTask}
              />
            </Card>
          )}

          <TaskList
            tasks={filteredTasks}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleTaskCompletion}
            onEdit={startEditTask}
            onReorder={(newTasks) => setTasks(newTasks)}
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-semibold">Task Overview</h2>
          <TaskStatistics tasks={tasks} />
          <h2 className="text-xl font-semibold">Activity Overview</h2>
          <Card className="p-4">
            <ContributionGraph tasks={tasks} />
          </Card>
        </div>
      </div>
      {showConfetti && <ConfettiCelebration />}
    </>
  )
}

