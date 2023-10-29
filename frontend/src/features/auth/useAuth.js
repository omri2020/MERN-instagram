import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { login, signup, authCheck, logout as apiLogout } from "../../api/auth";
import { connectSocket, disconnectSocket } from "../../services/socketService";

const useAuth = () => {
  // // const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [token, setToken] = useState(null);

  // AuthCheck
  const authQuery = useQuery({
    queryKey: ["authCheck"],
    queryFn: authCheck,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (authQuery.isSuccess) {
      console.log("Auth check success", authQuery.data);
      console.log("Auth check success", authQuery.data.isAuthenticated);
      setIsAuthenticated(authQuery.data.isAuthenticated);
      const user = authQuery.data.user;
      queryClient.setQueryData(["currentUser"], user);
    }
  }, [authQuery.isSuccess, authQuery.data]);

  // Login
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log("Login success", data);
      setIsAuthenticated(true);
      setToken(data.token);
      console.log(data.token);
      queryClient.setQueryData(["currentUser"], data.user);
      connectSocket(data.token);
      // navigate("/");
    },
    onError: (error) => console.error("Login error: ", error.message),
  });

  const loginUser = (userData) => {
    loginMutation.mutate(userData);
  };

  // Signup
  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      console.log("User created successfully");
      queryClient.invalidateQueries(["users"]);
      // navigate("/");
    },
    onError: (error) => console.log(error.message),
  });

  const signupUser = (userData) => {
    return new Promise((resolve, reject) => {
      signupMutation.mutate(userData, {
        onSuccess: resolve,
        onError: reject,
      });
    });
  };

  // Logout
  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      console.log("Logout success");
      setIsAuthenticated(false);
      queryClient.clear();
      disconnectSocket();
      window.location.href = "/login";
    },
    onError: (error) => console.log("Logout error: ", error.message),
  });

  const logoutUser = () => {
    logoutMutation.mutate();
  };

  console.log(token);
  return {
    token,
    loginUser,
    signupUser,
    logoutUser,
    isAuthenticated,
    isLoginLoading: loginMutation.isLoading,
    isSignupLoading: signupMutation.isLoading,
    isLogoutLoading: logoutMutation.isLoading,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    logoutError: logoutMutation.error,
    isAuthChecking: authQuery.isLoading || authQuery.isFetching,
    authCheckError: authQuery.isError,
  };
};

export default useAuth;
