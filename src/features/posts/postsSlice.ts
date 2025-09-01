import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { deletePost, getPosts } from "./postsAPI";
import type { RootState } from "../../app/store";
import { updatePost as postUpdatedAPI } from "./postsAPI";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostsState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "rejected";
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: "idle",
  error: null,
};

export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchPostsByUser",
  async (userId: number) => {
    const posts = await getPosts(userId);
    return posts;
  }
);

export const postUpdatedThunk = createAsyncThunk(
  "posts/postUpdated",
  async (post: Post) => {
    return await postUpdatedAPI(post);
  }
);

export const postDeletedThunk = createAsyncThunk(
  "posts/postDeleted",
  async (id: number) => {
    await deletePost(id);
    return id;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(
        postUpdatedThunk.fulfilled,
        (state, action: PayloadAction<Post>) => {
          const index = state.posts.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.posts[index] = action.payload;
          }
        }
      )
      .addCase(postDeletedThunk.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export const selectPosts = (state: RootState) => state.posts.posts;
export default postsSlice.reducer;
