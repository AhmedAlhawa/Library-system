import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export const useBorrowBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, bookId }: { userId: string; bookId: string }) => {
      const borrowDate = new Date().toISOString().split("T")[0];
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const borrowing = await axios.post("http://localhost:4000/borrowings", {
        userId,
        bookId,
        borrowDate,
        dueDate,
        returnDate: null,
        status: "borrowed",
      });

      await axios.patch(`http://localhost:4000/books/${bookId}`, {
        isAvailable: false,
      });

      return borrowing.data;
    },

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Book borrowed successfully!",
      });

      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Failed to borrow book",
        variant: "destructive",
      });
    },
  });
};
