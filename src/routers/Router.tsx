import { createBrowserRouter } from "react-router-dom";

import { HomePage } from "@pages/Home/HomePage";

export const router = () =>
  createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
  ]);
