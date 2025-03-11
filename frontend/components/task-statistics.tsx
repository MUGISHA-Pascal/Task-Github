import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "@/lib/types"
import { CheckCircle, Circle, Clock, AlertTriangle } from "lucide-react"

interface TaskStatisticsProps {
  tasks: Task[]
}

export function TaskStatistics({ tasks }: TaskStatisticsProps) {
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.filter((task) => !task.completed).length
  const overdueTasks = tasks.filter(
    (task) => !task.completed && task.dueDate && new Date(task.dueDate) < new Date(),
  ).length
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <Circle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTasks}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overdueTasks}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highPriorityTasks}</div>
        </CardContent>
      </Card>
    </div>
  )
}

