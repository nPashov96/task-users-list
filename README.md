# Task Users List

A simple React + Redux Toolkit project to manage tasks, users, and posts. Built with **Ant Design** for UI components.

---

## Features

### Home Page

- Displays a **list of users** in a centered card.
- Includes a **Tasks** button to navigate to the Tasks page.
- Optional **background image** covering the entire viewport.

### Tasks Page

- Displays a **list of tasks** in a card.
- Columns:
  - **ID**
  - **Title**
  - **Status** (checkbox to toggle completion)
  - **Owner** (username instead of user ID)
- **Filters:**
  - Status filter (All / Completed / Not Completed)
  - Title search
  - Owner filter (optional; can be removed)
- **Pagination:**
  - Fixed page size (default 10)
  - Fully scrollable card if tasks exceed viewport height.

### Posts Page

- Displays a **list of posts** in a card.
- Includes a **Back** button to return to Home page.
- Page card centered and scrollable.
- Supports full-screen **background image**.

### Global Features

- **Redux Toolkit** used for state management:
  - `tasksSlice` for tasks
  - `usersSlice` for users
- **Thunk middleware** for asynchronous API calls (`getTasksThunk`, `fetchUsers`, `updateTaskStatusThunk`)
- **Ant Design** components used:
  - Table, Card, Button, Checkbox, Select, Input
