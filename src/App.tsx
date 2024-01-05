import { RouterProvider } from "react-router-dom";

import { router } from "@routers/Router";

import "./App.css";

export const App: React.FC = () => {
  return <RouterProvider router={router()} />;
};
