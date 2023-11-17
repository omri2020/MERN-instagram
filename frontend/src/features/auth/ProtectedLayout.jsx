import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { SocketProvider, useSocket } from "../../contexts/SocketContext";
import PageLoader from "../../ui/PageLoader";

// new ProtectedLayout.jsx version
const ProtectedContent = ({ children }) => {
  const SocketContext = useSocket();
  const isConnected = SocketContext ? SocketContext.isConnected : false;

  console.log("Rendering children");

  return isConnected ? children : <PageLoader />;
};

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();
  const { authStatus } = useAuth();

  React.useEffect(() => {
    if (authStatus === "unauthenticated") {
      navigate("/login");
    }
  }, [authStatus, navigate]);

  if (authStatus === "authenticating") {
    return <PageLoader />;
  }

  return authStatus === "authenticated" ? (
    <SocketProvider>
      <ProtectedContent>{children}</ProtectedContent>
    </SocketProvider>
  ) : null;
};

export default ProtectedLayout;

// const ProtectedLayout = ({ children }) => {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   React.useEffect(() => {
//     // Redirect to login if not authenticated
//     if (isAuthenticated === false) {
//       console.log("Authentication failed, Redirecting to login page");
//       navigate("/login");
//     }
//   }, [isAuthenticated, navigate]);

//   // Show loader while authentication state is being determined
//   if (isAuthenticated === null) {
//     return <PageLoader />;
//   }

//   return isAuthenticated ? (
//     <SocketProvider>
//       <ProtectedContent>{children}</ProtectedContent>
//     </SocketProvider>
//   ) : null;
// };

// export default ProtectedLayout;
