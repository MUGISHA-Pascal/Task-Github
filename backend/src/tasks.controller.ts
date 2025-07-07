import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  completedAt?: string | null;
  category?: string;
}

let tasks: Task[] = [];

@Controller('api/tasks')
export class TasksController {
  @Get()
  getAll() {
    return tasks;
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return tasks.find((t) => t.id === id);
  }

  @Post()
  create(@Body() task: Omit<Task, 'id'>) {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    tasks.push(newTask);
    return newTask;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updated: Task) {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      tasks[idx] = updated;
      return updated;
    }
    return null;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    tasks = tasks.filter((t) => t.id !== id);
    return { success: true };
  }
} 