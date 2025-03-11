import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Task } from "./types"
import type { RootState } from "./store"

interface User {
  id: string
  name: string
  email: string
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User; token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<{ user: User; token: string }, { name: string; email: string; password: string }>({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
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
  useLoginMutation,
  useRegisterMutation,
  useGetTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = api

