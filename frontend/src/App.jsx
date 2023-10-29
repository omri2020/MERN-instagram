import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";

import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Modal from "./components/Modal";
import { SocketProvider } from "./hooks/useSocket";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";

import Home from "./pages/Home";
import AppLayout from "./ui/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedLayout from "./utils/ProtectedLayout";
import ProfilePage from "./pages/ProfilePage";
import { profileLoader } from "./features/user/Profile";

const SocketLayout = () => {
  const { token } = useAuthContext();
  console.log("Token in SocketLayout:", token);

  return (
    <SocketProvider token={token}>
      <Outlet />
    </SocketProvider>
  );
};

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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<SocketLayout />}>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedLayout>
            <AppLayout />
          </ProtectedLayout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route
          path="/:username"
          element={<ProfilePage />}
          loader={profileLoader}
        />
      </Route>
    </Route>,
  ),
);

function App() {
  return (
    <AuthProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <Modal>
          <RouterProvider router={router} />
        </Modal>
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </AuthProvider>
  );
}

export default App;
