import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import Posts from "./pages/Posts.tsx";
import Tasks from "./pages/Tasks.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import "@ant-design/v5-patch-for-react-19";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/users/:id/posts",
    element: <Posts />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/tasks",
    element: <Tasks />,
    errorElement: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
