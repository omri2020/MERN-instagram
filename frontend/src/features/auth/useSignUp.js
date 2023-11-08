import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../../api/auth";

export const useSignUp = () => {
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      console.log("User created successfully");
    },
    onError: (error) => console.log(error.message),
  });

  const signupUser = (userData) => {
    signupMutation.mutate(userData);
  };

  return {
    signupUser,
    isSignupLoading: signupMutation.isLoading,
    signupError: signupMutation.error,
  };
};
