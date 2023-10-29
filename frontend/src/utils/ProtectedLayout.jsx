import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../features/auth/useAuth";
import PageLoader from "../ui/PageLoader";

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, authCheckError, isAuthChecking } = useAuth();

  console.log("ProtectedLayout", {
    isAuthenticated,
    isAuthChecking,
    authCheckError,
  });

  React.useEffect(() => {
    if (isAuthenticated === false && !isAuthChecking) {
      navigate("/login");
    }
  }, [isAuthChecking, isAuthenticated, navigate]);

  if (isAuthChecking || isAuthenticated === null) {
    return <PageLoader />;
  }

  if (authCheckError) {
    return <div>Error checking authentication status</div>;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedLayout;
