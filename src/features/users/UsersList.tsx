import { fetchUsers, updateUser } from "./usersSlice";
import type { User } from "./types";
import { Button, Collapse, Input, Form, Space } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/usersList.css";

const { Panel } = Collapse;

const UsersList = () => {
  const usersList: User[] = useAppSelector((state) => state.users.users);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [editedUsers, setEditedUsers] = useState<{ [key: number]: User }>({});

  useEffect(() => {
    if (usersList.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersList.length]);

  function validateInput(user: User): boolean {
    if (!user.username.trim()) return false;
    if (!user.email.trim()) return false;
    if (!user.address.city.trim()) return false;
    if (!user.address.street.trim()) return false;
    if (!user.address.suite.trim()) return false;

    const emailCheck = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!emailCheck.test(user.email)) return false;

    return true;
  }

  function handleInputChange(id: number, field: string, value: string) {
    setEditedUsers((prev) => ({
      ...prev,
      [id]: {
        ...usersList.find((u) => u.id === id)!,
        ...prev[id],
        [field]: value,
        address: {
          ...usersList.find((u) => u.id === id)!.address,
          ...(prev[id]?.address || {}),
          ...(field.startsWith("address.")
            ? { [field.split(".")[1]]: value }
            : {}),
        },
      },
    }));
  }

  function handleCancel(id: number) {
    setEditedUsers((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }

  function handleSave(id: number) {
    const updatedUser = editedUsers[id];
    if (!updatedUser) return;

    dispatch(updateUser(updatedUser));
    setEditedUsers((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }

  function handleRevert(id: number) {
    const original = usersList.find((u) => u.id === id);
    editedUsers[id] = original!;
    setEditedUsers({ ...editedUsers });
  }

  function toggleEdit(id: number) {
    setEditedUsers((prev) => {
      if (prev[id]) {
        // exiting edit mode
        const updated = { ...prev };
        delete updated[id];
        // re-rendering without editedUsers[id]
        return updated;
      } else {
        return {
          ...prev,
          [id]: usersList.find((u) => u.id === id)!,
        };
      }
    });
  }

  function isChanged(id: number) {
    const original = usersList.find((u) => u.id === id);
    const edited = editedUsers[id];
    if (!original || !edited) return false;
    return JSON.stringify(edited) !== JSON.stringify(original);
  }

  return (
    <div>
      <Collapse className="users-container">
        {usersList.map((user) => {
          const isEditing = !!editedUsers[user.id];
          const currentData = editedUsers[user.id] || user;
          const isValid = validateInput(currentData);
          return (
            <Panel header={user.name} key={user.id}>
              {isEditing ? (
                <Form layout="horizontal">
                  <Form.Item label="Username" required>
                    <Input
                      value={currentData.username}
                      onChange={(e) =>
                        handleInputChange(user.id, "username", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Email" required>
                    <Input
                      value={currentData.email}
                      onChange={(e) =>
                        handleInputChange(user.id, "email", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item label="City" required>
                    <Input
                      value={currentData.address.city}
                      onChange={(e) =>
                        handleInputChange(
                          user.id,
                          "address.city",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Street" required>
                    <Input
                      value={currentData.address.street}
                      onChange={(e) =>
                        handleInputChange(
                          user.id,
                          "address.street",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Suite" required>
                    <Input
                      value={currentData.address.suite}
                      onChange={(e) =>
                        handleInputChange(
                          user.id,
                          "address.suite",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                  <div className="user-buttons">
                    <Space>
                      <Button
                        onClick={() => {
                          handleSave(user.id);
                        }}
                        disabled={!isChanged(user.id) || !isValid}
                        type="primary"
                      >
                        Save
                      </Button>
                      <Button danger onClick={() => handleCancel(user.id)}>
                        Cancel
                      </Button>
                      <Button onClick={() => handleRevert(user.id)}>
                        Revert
                      </Button>
                    </Space>
                  </div>
                </Form>
              ) : (
                <div className="users-view-only">
                  <div className="user-info">
                    <p>
                      <b>Username: </b>
                      {user.username}
                    </p>
                    <p>
                      <b>E-Mail: </b>
                      {user.email}
                    </p>
                    <p>
                      <b>City: </b>
                      {user.address.city}
                    </p>
                    <p>
                      <b>Street: </b>
                      {user.address.street}
                    </p>
                    <p>
                      <b>Suite: </b>
                      {user.address.suite}
                    </p>
                  </div>
                  <div className="user-buttons">
                    <Space>
                      <Button type="dashed" onClick={() => toggleEdit(user.id)}>
                        Edit
                      </Button>
                      <Button
                        onClick={() => navigate(`/users/${user.id}/posts`)}
                      >
                        See Posts
                      </Button>
                    </Space>
                  </div>
                </div>
              )}
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default UsersList;
