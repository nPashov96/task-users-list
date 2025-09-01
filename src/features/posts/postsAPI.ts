import axios from "axios";
import type { Post } from "./postsSlice";

export const getPosts = async (userId: number): Promise<Post[]> => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  return response.data;
};

export const updatePost = async (post: Post): Promise<Post> => {
  try {
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/posts/${post.id}`,
      post
    );
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id: number): Promise<void> => {
  try {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
  } catch (error) {
    console.log("Error deleting post:", error);
    throw error;
  }
};
