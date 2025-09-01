import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import TasksList from "../features/tasks/TasksList";

const Tasks = () => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ padding: 16 }}>
        <Button onClick={() => navigate("/")}>Back</Button>
      </div>
      <TasksList />
    </>
  );
};

export default Tasks;
