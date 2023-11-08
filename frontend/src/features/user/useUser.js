import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/user";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const username = localStorage.getItem("username");
  const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getUser(username),
  });

  useEffect(() => {
    if (isSuccess) {
      setUser(data.user);
    }
  }, [isSuccess, user, data]);

  return {
    user,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  };
};
