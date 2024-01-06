import { RouterProvider } from "react-router-dom";

import { router } from "@routers/Router";

export const App: React.FC = () => {
  return <RouterProvider router={router()} />;
};
