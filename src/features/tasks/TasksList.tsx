import { useEffect } from "react";
import { Table, Input, Select, Checkbox, Card } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getTasksThunk, updateTaskStatusThunk, type Task } from "./tasksSlice";
import { useState } from "react";
import { fetchUsers } from "../users/usersSlice";
import "../../styles/tasksList.css";

const TasksList = () => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Status",
      dataIndex: "completed",
      key: "completed",
      render: (completed: boolean, record: Task) => (
        <Checkbox
          checked={completed}
          onChange={(e) => handleStatusChange(record.id, e.target.checked)}
        >
          {completed ? "Completed" : "Not Completed"}
        </Checkbox>
      ),
    },
    {
      title: "Owner",
      dataIndex: "userId",
      key: "userId",
      render(userId: number) {
        const user = usersList.find((u) => u.id === userId);
        return user ? user.username : "Unknown";
      },
    },
  ];
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const usersList = useAppSelector((state) => state.users.users);

  //   task filtering
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "not_completed"
  >();
  const [titleFilter, setTitleFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState<number | undefined>(undefined);

  //   task status
  function handleStatusChange(id: number, completed: boolean) {
    dispatch(updateTaskStatusThunk({ id, completed }));
  }

  //   fetch tasks
  useEffect(() => {
    dispatch(getTasksThunk());
  }, [dispatch]);

  //   fetch users
  useEffect(() => {
    if (usersList.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersList.length]);

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "completed" && !task.completed) return false;
    if (statusFilter === "not_completed" && task.completed) return false;
    if (
      titleFilter &&
      !task.title.toLowerCase().includes(titleFilter.toLowerCase())
    )
      return false;
    if (ownerFilter && task.userId !== ownerFilter) return false;
    return true;
  });

  return (
    <>
      <Card className="tasks-card">
        <h2 className="tasks-title">Tasks</h2>
        <div className="task-filter">
          <Select
            value={statusFilter}
            placeholder="Filter by status"
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="not_completed">Not completed</Select.Option>
          </Select>
          <Input
            placeholder="Search by title"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            style={{ width: 200 }}
          ></Input>
          <Select
            value={ownerFilter}
            onChange={setOwnerFilter}
            style={{ width: 180 }}
            allowClear
            placeholder="Filter by owner"
          >
            {usersList.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {user.username}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
            onShowSizeChange: (_, size) => setPageSize(size),
          }}
          style={{ marginTop: 16 }}
        />
      </Card>
    </>
  );
};

export default TasksList;
