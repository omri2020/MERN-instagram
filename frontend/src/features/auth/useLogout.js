import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import { disconnectSocket } from "../../services/socketService";
import { clearToken } from "../../services/tokenService";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      console.log("Logout success");
      localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
      queryClient.resetQueries({ queryKey: ["authCheck"] });
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      disconnectSocket();
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
