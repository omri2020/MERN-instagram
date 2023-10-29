import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../api/user";

export function useUsers() {
  const query = useQuery({ queryKey: ["users"], queryFn: getUsers });

  const { data: responseData = {}, isLoading, error } = query;

  // Safely extract users from responseData
  const users = responseData.data?.data?.users || [];

  return { users, isLoading, error };
}
