"use client"

import { useState, useMemo } from "react"
import { format, subDays, eachDayOfInterval, isSameDay, startOfWeek, addDays } from "date-fns"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ContributionGraphProps {
  tasks: Task[]
  days?: number
}

export default function ContributionGraph({ tasks, days = 365 }: ContributionGraphProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const router = useRouter()

  // Generate dates for the last X days
  const dateRange = useMemo(() => {
    const today = new Date()
    return eachDayOfInterval({
      start: subDays(today, days - 1),
      end: today,
    })
  }, [days])

  // Group dates into weeks for the grid
  const weeks = useMemo(() => {
    const result = []
    let currentWeek = []

    // Get the start of the week for the first date
    const firstDate = dateRange[0]
    const startDay = startOfWeek(firstDate, { weekStartsOn: 0 }) // 0 = Sunday

    // Add empty cells for days before the first date
    let dayOfWeek = 0
    let currentDate = startDay

    while (dayOfWeek < 7) {
      if (isSameDay(currentDate, firstDate) || currentDate > firstDate) {
        break
      }
      currentWeek.push(null) // Empty cell
      currentDate = addDays(currentDate, 1)
      dayOfWeek++
    }

    // Add the actual dates
    for (const date of dateRange) {
      if (currentWeek.length === 7) {
        result.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push(date)
    }

    // Add the last week if it's not empty
    if (currentWeek.length > 0) {
      // Fill the rest of the week with empty cells
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      result.push(currentWeek)
    }

    return result
  }, [dateRange])

  const getActivityLevel = (date: Date | null) => {
    if (!date) return "bg-muted hover:bg-muted/80 dark:bg-muted/20 dark:hover:bg-muted/30"

    const completedTasks = tasks.filter(
      (task) => task.completed && task.completedAt && isSameDay(new Date(task.completedAt), date),
    )

    const count = completedTasks.length

    // Define color gradients for light and dark modes
    const lightGradient = [
      "bg-emerald-50 hover:bg-emerald-100",
      "bg-emerald-100 hover:bg-emerald-200",
      "bg-emerald-200 hover:bg-emerald-300",
      "bg-emerald-300 hover:bg-emerald-400",
      "bg-emerald-400 hover:bg-emerald-500",
      "bg-emerald-500 hover:bg-emerald-600",
    ]

    const darkGradient = [
      "dark:bg-emerald-950 dark:hover:bg-emerald-900",
      "dark:bg-emerald-900 dark:hover:bg-emerald-800",
      "dark:bg-emerald-800 dark:hover:bg-emerald-700",
      "dark:bg-emerald-700 dark:hover:bg-emerald-600",
      "dark:bg-emerald-600 dark:hover:bg-emerald-500",
      "dark:bg-emerald-500 dark:hover:bg-emerald-400",
    ]

    if (count === 0) return "bg-muted hover:bg-muted/80 dark:bg-muted/20 dark:hover:bg-muted/30"

    const index = Math.min(count - 1, lightGradient.length - 1)
    return `${lightGradient[index]} ${darkGradient[index]}`
  }

  // Get tasks for a specific date
  const getTasksForDate = (date: Date | null) => {
    if (!date) return []

    return tasks.filter((task) => task.completed && task.completedAt && isSameDay(new Date(task.completedAt), date))
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDayClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    router.push(`/daily/${formattedDate}`)
  }

  return (
    <div className="space-y-4">
      {/* Month labels */}
      <div className="flex text-xs text-muted-foreground mb-1">
        <div className="w-6"></div> {/* Space for day labels */}
        <div className="flex-1 flex">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => (
            <div key={month} className="flex-1 text-center">
              {month}
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        <div className="grid grid-rows-7 grid-flow-row gap-[2px] mr-2">
          {dayLabels.map((day, i) => (
            <div
              key={day}
              className="h-[10px] w-[10px] flex items-center justify-center text-[9px] text-muted-foreground"
            >
              {day[0]}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-flow-col gap-[2px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-[2px]">
              {week.map((date, dayIndex) => {
                const activityLevel = getActivityLevel(date)
                const tasksForDate = getTasksForDate(date)

                return (
                  <TooltipProvider key={dayIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "h-[10px] w-[10px] rounded-[2px] cursor-pointer",
                            activityLevel,
                            !date && "opacity-0",
                          )}
                          onMouseEnter={() => date && setHoveredDate(date)}
                          onMouseLeave={() => setHoveredDate(null)}
                          onClick={() => date && handleDayClick(date)}
                        />
                      </TooltipTrigger>
                      {date && (
                        <TooltipContent side="top" align="center">
                          <div className="text-xs font-medium">{format(date, "MMM d, yyyy")}</div>
                          <div className="text-xs">
                            {tasksForDate.length === 0
                              ? "No completed tasks"
                              : `${tasksForDate.length} completed task${tasksForDate.length === 1 ? "" : "s"}`}
                          </div>
                          {tasksForDate.length > 0 && (
                            <ul className="mt-1 text-xs max-w-[200px]">
                              {tasksForDate.slice(0, 3).map((task, i) => (
                                <li key={i} className="truncate">
                                  • {task.title}
                                </li>
                              ))}
                              {tasksForDate.length > 3 && <li>• and {tasksForDate.length - 3} more...</li>}
                            </ul>
                          )}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Update the legend to show the gradient */}
      <div className="flex items-center justify-end gap-2 mt-2">
        <div className="text-xs text-muted-foreground">Less</div>
        <div className="flex gap-[2px]">
          <div className="h-[10px] w-[10px] rounded-[2px] bg-muted dark:bg-muted/20" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-emerald-50 dark:bg-emerald-950" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-emerald-100 dark:bg-emerald-900" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-emerald-200 dark:bg-emerald-800" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-emerald-300 dark:bg-emerald-700" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-emerald-400 dark:bg-emerald-600" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-emerald-500 dark:bg-emerald-500" />
        </div>
        <div className="text-xs text-muted-foreground">More</div>
      </div>

      {hoveredDate && (
        <div className="text-sm mt-4">
          <h3 className="font-medium">{format(hoveredDate, "MMMM d, yyyy")}</h3>
          <div className="mt-2">
            {getTasksForDate(hoveredDate).length === 0 ? (
              <p className="text-muted-foreground">No completed tasks on this day</p>
            ) : (
              <div className="space-y-1">
                {getTasksForDate(hoveredDate).map((task, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{task.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

