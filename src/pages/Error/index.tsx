import { AlertCircle, Home, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error?: Error;
};

export const ErrorPage = ({ error }: ErrorPageProps) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="mb-4 text-red-500">
        <AlertCircle size={64} />
      </div>
      <h1 className="mb-2 text-3xl font-bold">Oops! Something went wrong</h1>
      <p className="mb-4 text-center text-gray-600">
        We're sorry, but an unexpected error occurred. Our team has been
        notified and is working on a fix.
      </p>
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <p className="font-bold">Error details:</p>
          <p>{error.message}</p>
        </div>
      )}
      <div className="flex space-x-4">
        <Button onClick={handleRefresh} className="flex items-center">
          <RefreshCw className="mr-2" size={18} />
          Refresh Page
        </Button>
        <Button
          onClick={handleGoHome}
          variant="outline"
          className="flex items-center"
        >
          <Home className="mr-2" size={18} />
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};
