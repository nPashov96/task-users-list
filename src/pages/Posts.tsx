import PostsList from "../features/posts/PostsList";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/postsPage.css";

const Posts = () => {
  const navigate = useNavigate();
  return (
    <div className="posts-page-container">
      <div style={{ padding: 16 }}>
        <Button onClick={() => navigate("/")} style={{ marginBottom: "16px" }}>
          Back
        </Button>
      </div>
      <PostsList />
    </div>
  );
};

export default Posts;
