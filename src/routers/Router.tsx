import { Navigate, createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@routers/RootLayout";

import { ChatPage } from "@pages/Chat";
import { ErrorPage } from "@pages/Error";
import { LoginPage } from "@pages/Login";
import { SignUpPage } from "@pages/SignUp";

import { AuthRoute } from "./AuthRoute";

export const router = () =>
  createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthRoute>
          <RootLayout />
        </AuthRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <ChatPage /> },
        { path: "user/:id?", element: <ChatPage /> },
        { path: "room/:id?", element: <ChatPage /> },
      ],
    },
    { path: "login", element: <LoginPage /> },
    { path: "sign-up", element: <SignUpPage /> },
    { path: "*", element: <Navigate to="/room" replace /> },
  ]);
