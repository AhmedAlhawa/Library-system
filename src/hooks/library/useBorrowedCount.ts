import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useBorrowedCount = () => {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["borrowings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await axios.get(`http://localhost:4000/borrowings?userId=${user.id}`);
      // Count only books not returned
      return res.data.filter((b: any) => b.status === "borrowed");
    },
    enabled: !!user,
  });

  return data?.length ?? 0;
};
