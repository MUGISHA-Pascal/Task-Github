"use client"

import { useState } from "react"
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
import { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function TaskManager() {
  const { data: tasks = [], isLoading, isFetching, refetch } = useGetTasksQuery()
  const [addTask, { isLoading: isAdding }] = useAddTaskMutation()
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const { toast } = useToast()
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  const handleAddTask = async (task: Omit<Task, "id">) => {
    try {
      await addTask(task).unwrap()
      setIsFormOpen(false)
      refetch()
      toast({ title: "Task created!", description: `Task '${task.title}' was added successfully.` })
    } catch (e) {
      toast({ title: "Failed to add task", description: (e as Error)?.message || "An error occurred.", variant: "destructive" })
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask).unwrap()
      setEditingTask(null)
      setIsFormOpen(false)
      refetch()
      toast({ title: "Task updated!", description: `Task '${updatedTask.title}' was updated successfully.` })
    } catch (e) {
      toast({ title: "Failed to update task", description: (e as Error)?.message || "An error occurred.", variant: "destructive" })
    }
  }

  const handleDeleteTask = async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id)
    try {
      setDeletingTaskId(id)
      await deleteTask(id).unwrap()
      refetch()
      toast({ title: "Task deleted!", description: `Task '${taskToDelete?.title || id}' was deleted.` })
    } catch (e) {
      toast({ title: "Failed to delete task", description: (e as Error)?.message || "An error occurred.", variant: "destructive" })
    } finally {
      setDeletingTaskId(null)
    }
  }

  const handleToggleTaskCompletion = async (task: Task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null,
    }
    try {
      await updateTask(updatedTask).unwrap()
      if (!task.completed) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
      refetch()
    } catch (e) {
      // Optionally show error toast
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

  if (isLoading || isFetching) {
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
                isSubmitting={editingTask ? isUpdating : isAdding}
              />
            </Card>
          )}

          <TaskList
            tasks={filteredTasks}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleTaskCompletion}
            onEdit={startEditTask}
            onReorder={() => {}}
            deletingTaskId={deletingTaskId || undefined}
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

