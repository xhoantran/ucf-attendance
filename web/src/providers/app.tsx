import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router } from "react-router-dom";

import { Button, Spinner } from "@/components/Elements";
import { Notifications } from "@/components/Notifications/Notifications";
import { AuthProvider } from "@/stores/useAuth";
import { queryClient } from "@/lib/react-query";

const ErrorFallback = () => {
  return (
    <div
      className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
      <Button
        className="mt-4"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </div>
  );
};

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {import.meta.env.NODE_ENV !== "test" && <ReactQueryDevtools />}
          <Notifications />
          <AuthProvider>
            <Router>{children}</Router>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
