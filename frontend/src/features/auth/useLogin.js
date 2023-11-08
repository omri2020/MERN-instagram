import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../../services/socketService";
import { login } from "../../api/auth";
import { setToken } from "../../services/tokenService";
import { useAuth } from "../../contexts/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setIsAuthenticated } = useAuth();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login success");
      localStorage.setItem("username", data.user.username);
      setToken(data.accessToken);
      setIsAuthenticated(true);
      queryClient.invalidateQueries(["authCheck"]);
      connectSocket();
      navigate("/");
    },
    onError: (error) => console.log("Login error: ", error.message),
  });

  const loginUser = (userData) => {
    loginMutation.mutate(userData);
  };

  return {
    loginUser,
    isLoginLoading: loginMutation.isLoading,
    loginError: loginMutation.error,
  };
};
