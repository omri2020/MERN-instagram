import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from "./contexts/SocketContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import Modal from "./components/Modal";
import Home from "./pages/Home";
import AppLayout from "./ui/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedLayout from "./features/auth/ProtectedLayout";
import ProfilePage from "./pages/ProfilePage";
import { profileLoader } from "./features/user/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
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
    </>,
  ),
);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <UserProvider>
          <Modal>
            <RouterProvider router={router} />
          </Modal>
          <ReactQueryDevtools initialIsOpen={false} />
        </UserProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
