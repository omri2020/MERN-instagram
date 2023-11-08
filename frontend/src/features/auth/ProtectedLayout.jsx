import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PageLoader from "../../ui/PageLoader";
import { useSocket } from "../../contexts/SocketContext";

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { isConnected } = useSocket();

  React.useEffect(() => {
    if (isAuthenticated === false) {
      console.log("Authentication failed, Redirecting to login page");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (
    isAuthenticated === null ||
    isConnected === null ||
    isConnected === false
  ) {
    return <PageLoader />;
  }

  console.log("Rendering children");
  return isAuthenticated ? children : null;
};

export default ProtectedLayout;
