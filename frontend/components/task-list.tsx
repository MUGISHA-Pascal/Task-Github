"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Edit, Trash2, Loader } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: string) => void
  onToggleComplete: (task: Task) => void
  onEdit: (task: Task) => void
  onReorder: (tasks: Task[]) => void
  deletingTaskId?: string
}

export default function TaskList({ tasks, onDelete, onToggleComplete, onEdit, onReorder, deletingTaskId }: TaskListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const items = Array.from(filteredTasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    onReorder(items)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No tasks found. Add a new task to get started.
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn("transition-all", task.completed && "opacity-80")}
                      >
                        <CardContent className="p-4 flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => onToggleComplete(task)}
                              className="mt-1"
                            />
                            <div className="space-y-1">
                              <h3 className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                                {task.title}
                              </h3>
                              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {task.priority && (
                                  <Badge
                                    variant={
                                      task.priority === "high"
                                        ? "destructive"
                                        : task.priority === "medium"
                                          ? "default"
                                          : "secondary"
                                    }
                                  >
                                    {task.priority}
                                  </Badge>
                                )}
                                {task.dueDate && (
                                  <Badge variant="outline">Due: {new Date(task.dueDate).toLocaleDateString()}</Badge>
                                )}
                                <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>
                              </div>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                >
                                  <path
                                    d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEdit(task)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDelete(task.id)}
                                className="text-destructive focus:text-destructive"
                                disabled={deletingTaskId === task.id}
                              >
                                {deletingTaskId === task.id ? (
                                  <span className="flex items-center"><Loader className="h-4 w-4 mr-2 animate-spin" />Deleting...</span>
                                ) : (
                                  <><Trash2 className="h-4 w-4 mr-2" />Delete</>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "Work":
      return "bg-blue-500 hover:bg-blue-600"
    case "Personal":
      return "bg-green-500 hover:bg-green-600"
    case "Health":
      return "bg-red-500 hover:bg-red-600"
    case "Education":
      return "bg-purple-500 hover:bg-purple-600"
    case "Finance":
      return "bg-yellow-500 hover:bg-yellow-600"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}

