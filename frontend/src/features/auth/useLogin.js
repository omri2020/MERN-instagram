import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../services/tokenService";
import { login } from "../../api/auth";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login success");
      localStorage.setItem("username", data.user.username);
      setToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["authCheck"] });
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
