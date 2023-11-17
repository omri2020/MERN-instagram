import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import IconSidebar from "./IconSidebar";
import { useChatSocketListeners } from "../sockets/hooks/useChatSocketListeners";

function AppLayout() {
  // check if we are on the direct inbox page
  const { pathname } = useLocation();
  const isDirectInbox = pathname.includes("/direct/inbox");

  // listen to chat events
  useChatSocketListeners();

  return (
    <main className="flex">
      {isDirectInbox ? <IconSidebar /> : <Sidebar />}
      <Outlet />
    </main>
  );
}

export default AppLayout;
