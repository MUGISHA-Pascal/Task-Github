import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Task } from "./types"

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "tasks",
      providesTags: ["Task"],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),
    addTask: builder.mutation<Task, Omit<Task, "id">>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<Task, Task>({
      query: (task) => ({
        url: `tasks/${task.id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Task", id }],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = api

