import axios from "axios";
import type { User } from "./types";

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
};
