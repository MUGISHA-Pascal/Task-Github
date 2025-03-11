import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  user: User | null
  token: string | null
}

interface User {
  id: string
  email: string
  name: string
}

const initialState: AuthState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logout: (state) => {
      state.user = null
      state.token = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token

