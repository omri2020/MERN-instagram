import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import { clearToken } from "../../services/tokenService";
import { logout } from "../../api/auth";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      console.log("Logout success");
      localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
      localStorage.removeItem("username");
      queryClient.clear();
      clearToken();
    },
    onError: (error) => console.log("Logout error: ", error.message),
  });

  const logoutUser = () => {
    logoutMutation.mutate();
    navigate("/login");
  };

  return {
    logoutUser,
    isLogoutLoading: logoutMutation.isLoading,
    logoutError: logoutMutation.error,
  };
};
