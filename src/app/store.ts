import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import postsReducer from "../features/posts/postsSlice";
import tasksReducer from "../features/tasks/tasksSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
