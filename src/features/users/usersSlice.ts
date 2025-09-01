import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User, UsersState } from "./types";
import { getUsers, getUserById } from "./usersAPI";

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await getUsers();
});

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: number) => {
    return await getUserById(id);
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<User>) {
      const updatedUser = action.payload;
      const index = state.users.findIndex((u) => u.id === updatedUser.id);

      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    },
    clearUsers(state) {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.error = null;
        state.users = action.payload;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;

        const updatedUser = action.payload;
        const index = state.users.findIndex((u) => u.id === updatedUser.id);

        if (index !== -1) {
          state.users[index] = updatedUser;
        } else {
          state.users.push(updatedUser);
        }
      });
  },
});

export const { updateUser, clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
