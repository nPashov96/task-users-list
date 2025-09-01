import axios from "axios";

export const getAllTasks = async () => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/todos`
  );
  return response.data;
};

export const updateTaskStatus = async ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  const response = await axios.patch(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
    {
      completed,
    }
  );
  return response.data;
};
