import React from "react";
import ReactDOM from "react-dom/client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App.jsx";
import "./styles.css";
import ErrorFallback from "./ui/ErrorFallback.jsx";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // data is fresh for 5 minutes
      cacheTime: 1000 * 60 * 60 * 24, // data is removed from cache after 24 hours
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <App />
    </PersistQueryClientProvider>
  </ErrorBoundary>,
  // </React.StrictMode>,
);
