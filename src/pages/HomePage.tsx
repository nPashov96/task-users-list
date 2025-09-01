import { Button } from "antd";
import UsersList from "../features/users/UsersList";
import { useNavigate } from "react-router-dom";
import "../styles/homePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page-container">
      <div className="home-page">
        <h1 className="title">Task Users List</h1>
        <div style={{ marginBottom: 24 }}>
          <UsersList />
        </div>
        <div>
          <Button
            type="primary"
            size="large"
            id="tasks-button"
            onClick={() => navigate(`/tasks`)}
          >
            Tasks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
