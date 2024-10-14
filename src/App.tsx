import { RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";

import { router } from "@routers/Router";

import ErrorBoundary from "@components/Error/ErrorBoundary";
import { ModalProvider } from "@components/Modal/ModalProvider";

import { ErrorPage } from "@pages/Error";

import "./firebase";

export const App: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: {},
  });

  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <ErrorBoundary fallback={<ErrorPage />}>
            <RouterProvider router={router()} />
          </ErrorBoundary>
        </ModalProvider>
      </QueryClientProvider>
    </Provider>
  );
};
