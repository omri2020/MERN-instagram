import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <main className="flex">
      <Sidebar />
      <Outlet />
    </main>
  );
}

export default AppLayout;
