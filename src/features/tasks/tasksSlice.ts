import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getAllTasks, updateTaskStatus } from "./tasksAPI";

export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const getTasksThunk = createAsyncThunk("tasks/getTasks", async () => {
  return await getAllTasks();
});

export const updateTaskStatusThunk = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, completed }: { id: number; completed: boolean }) => {
    const updatedTask = await updateTaskStatus({ id, completed });
    return await updateTaskStatus({ id, completed: updatedTask.completed });
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasksThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getTasksThunk.fulfilled,
        (state, action: PayloadAction<Task[]>) => {
          state.loading = false;
          state.error = null;
          state.tasks = action.payload;
        }
      )
      .addCase(getTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(updateTaskStatusThunk.fulfilled, (state, action) => {
        const { id, completed } = action.payload;
        const task = state.tasks.find((task) => task.id === id);
        if (task) {
          task.completed = completed;
        }
      });
  },
});

export default tasksSlice.reducer;
