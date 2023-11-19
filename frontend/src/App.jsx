import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Modal from "./components/Modal";
import Home from "./pages/Home";
import AppLayout from "./ui/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedLayout from "./features/auth/ProtectedLayout";
import ProfilePage from "./pages/ProfilePage";
import { profileLoader } from "./features/user/Profile";
import InboxPage from "./pages/InboxPage";
import MessagesBox from "./features/chat/MessagesBox";
import { UserProvider } from "./contexts/UserContext";

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
        <Route path="/direct/inbox" element={<InboxPage />}>
          <Route path="/direct/inbox/:chatId" element={<MessagesBox />} />
        </Route>
      </Route>
    </>,
  ),
);

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatProvider>
          <NotificationProvider>
            <Modal>
              <RouterProvider router={router} />
            </Modal>
          </NotificationProvider>
        </ChatProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </AuthProvider>
  );
}

export default App;
