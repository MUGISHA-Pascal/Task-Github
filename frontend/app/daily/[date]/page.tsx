"use client"

import { useParams, useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { useGetTasksQuery } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DailyTasksPage() {
  const params = useParams()
  const router = useRouter()
  const date = parseISO(params.date as string)
  const { data: tasks = [] } = useGetTasksQuery()

  const tasksForDate = tasks.filter(
    (task) => task.completed && task.completedAt && format(new Date(task.completedAt), "yyyy-MM-dd") === params.date,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Tasks for {format(date, "MMMM d, yyyy")}</h1>
      </div>

      <p className="text-lg">
        {tasksForDate.length === 0
          ? "No tasks completed on this day."
          : `${tasksForDate.length} task${tasksForDate.length === 1 ? "" : "s"} completed on this day.`}
      </p>

      {tasksForDate.length > 0 && (
        <div className="space-y-4">
          {tasksForDate.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <h2 className="font-semibold">{task.title}</h2>
                {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                <p className="text-sm mt-2">Completed at: {format(new Date(task.completedAt!), "HH:mm")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

