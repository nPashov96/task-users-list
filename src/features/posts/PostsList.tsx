import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostsByUser } from "./postsSlice";
import type { Post } from "./postsSlice";
import { postDeletedThunk } from "./postsSlice";
import type { User } from "../users/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button, Input, Form, Space, Modal } from "antd";
import { fetchUserById, updateUser } from "../users/usersSlice";
import { postUpdatedThunk } from "./postsSlice";
import "../../styles/postsList.css";

const Posts = () => {
  const dispatch = useAppDispatch();
  const postsStatus = useAppSelector((state) => state.posts.status);
  const postError = useAppSelector((state) => state.posts.error);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  // tracking currently edited post
  const [postBeingEdited, setPostBeingEdited] = useState<Post | null>(null);
  const [postBeingEditedID, setPostBeingEditedID] = useState<number | null>(
    null
  );
  // getting the user info
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const user = useAppSelector((state) =>
    state.users.users.find((u) => u.id === userId)
  );

  // fetching posts for selected user
  const postsList: Post[] = useAppSelector((state) => state.posts.posts);

  useEffect(() => {
    if (userId) {
      dispatch(fetchPostsByUser(userId));
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  function clonseUser(user: User): User {
    return {
      ...user,
      address: { ...user.address },
    };
  }

  function handleInputChangeUser(field: string, value: string) {
    setEditedUser((prev) => {
      if (!prev) return null;

      // check if its address
      if (field.startsWith("address.")) {
        const addressField = field.split(".")[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value,
          },
        };
      }

      // if not - its top level field
      return {
        ...prev,
        [field]: value,
      };
    });
  }

  function handleInputChangePost(field: string, value: string) {
    setPostBeingEdited((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  }

  function handleSaveUser() {
    if (!editedUser) return;
    dispatch(updateUser(editedUser));
    setEditedUser(null);
  }

  function handleSavePost(post: Post | null) {
    if (!post) return;
    dispatch(postUpdatedThunk(post));
    setPostBeingEdited(null);
    setPostBeingEditedID(null);
  }

  function handleDeletePost(id: number) {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      onOk: () => dispatch(postDeletedThunk(id)),
    });
  }

  function toggleEdit() {
    if (!user) return;
    setEditedUser((prev) => (prev ? null : clonseUser(user)));
  }

  function isChanged() {
    if (!editedUser || !user) return false;
    return JSON.stringify(editedUser) !== JSON.stringify(user);
  }

  function isValid(user: User) {
    if (!user.username.trim()) return false;
    if (!user.email.trim()) return false;
    if (!user.address.city.trim()) return false;
    if (!user.address.suite.trim()) return false;
    if (!user.address.street.trim()) return false;
    if (!user.name.trim()) return false;

    const emailCheck = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!emailCheck.test(user.email)) return false;
    return true;
  }

  if (!postsList) {
    return (
      <section>
        <h2>No posts found!</h2>
      </section>
    );
  }

  return (
    <div className="combined-container">
      <div className="user-section">
        {editedUser ? (
          <div className="user-edit-form">
            <Form layout="vertical">
              <Form.Item label="Username">
                <Input
                  value={editedUser.username}
                  onChange={(e) =>
                    handleInputChangeUser("username", e.target.value)
                  }
                  required
                />
              </Form.Item>
              <Form.Item label="Email">
                <Input
                  value={editedUser.email}
                  onChange={(e) =>
                    handleInputChangeUser("email", e.target.value)
                  }
                  required
                />
              </Form.Item>
              <Form.Item label="City">
                <Input
                  value={editedUser?.address?.city}
                  onChange={(e) =>
                    handleInputChangeUser("address.city", e.target.value)
                  }
                  required
                ></Input>
              </Form.Item>
              <Form.Item label="Street">
                <Input
                  value={editedUser?.address?.street}
                  onChange={(e) =>
                    handleInputChangeUser("address.street", e.target.value)
                  }
                  required
                ></Input>
              </Form.Item>
              <Form.Item label="Suite">
                <Input
                  value={editedUser?.address?.suite}
                  onChange={(e) =>
                    handleInputChangeUser("address.suite", e.target.value)
                  }
                  required
                ></Input>
              </Form.Item>
              <Space>
                <Button onClick={toggleEdit}>Cancel</Button>
                <Button
                  type="primary"
                  onClick={() => handleSaveUser()}
                  disabled={!isChanged() || !isValid(editedUser)}
                >
                  Save user info
                </Button>
              </Space>
            </Form>
          </div>
        ) : (
          <div className="user-view-only">
            <h2>{user?.name}</h2>
            <p>
              <b>Username: </b>
              {user?.username}
            </p>
            <p>
              <b>E-Mail: </b>
              {user?.email}
            </p>
            <p>
              <b>City: </b>
              {user?.address.city}
            </p>
            <p>
              <b>Street: </b>
              {user?.address.street}
            </p>
            <p>
              <b>Suite: </b>
              {user?.address.suite}
            </p>
            <Button type="dashed" danger onClick={toggleEdit}>
              Edit user info
            </Button>
          </div>
        )}
      </div>
      <div className="posts-container">
        {postsStatus === "loading" && <p>Loading posts...</p>}
        {postsStatus === "rejected" && <p>Error: {postError}</p>}
        {postsStatus === "succeeded" && (
          <>
            <h3>Posts by: {user?.username}</h3>
            <ol className="posts-ol">
              {postsList.map((p) => {
                const isEditing = postBeingEditedID === p.id;
                return (
                  <li key={p.id}>
                    {isEditing ? (
                      <div className="post-edit-form">
                        <Input
                          value={postBeingEdited?.title}
                          onChange={(e) =>
                            handleInputChangePost("title", e.target.value)
                          }
                        />
                        <Input
                          value={postBeingEdited?.body}
                          onChange={(e) =>
                            handleInputChangePost("body", e.target.value)
                          }
                        />
                        <div className="post-buttons">
                          <Button
                            onClick={() => {
                              setPostBeingEdited(null);
                              setPostBeingEditedID(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => handleSavePost(postBeingEdited)}
                            disabled={
                              !postBeingEdited ||
                              !postBeingEdited.title.trim() ||
                              !postBeingEdited.body.trim()
                            }
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="post-view-only">
                        <h4>{p.title}</h4>
                        <p>{p.body}</p>
                        <div className="post-buttons">
                          <Button
                            variant="solid"
                            color="primary"
                            onClick={() => {
                              setPostBeingEdited(p);
                              setPostBeingEditedID(p.id);
                            }}
                          >
                            Edit post
                          </Button>
                          <Button danger onClick={() => handleDeletePost(p.id)}>
                            Delete post
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;
