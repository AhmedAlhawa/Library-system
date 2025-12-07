import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Borrowing, Book } from "@/types/library";

interface BorrowingWithBook extends Borrowing {
  book?: Book;
}

export const useReturnBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (borrowing: BorrowingWithBook) => {
      await axios.patch(`http://localhost:4000/borrowings/${borrowing.id}`, {
        returnDate: new Date().toISOString().split("T")[0],
        status: "returned",
      });

      await axios.delete(`http://localhost:4000/borrowings/${borrowing.id}`);

      await axios.patch(`http://localhost:4000/books/${borrowing.bookId}`, {
        isAvailable: true,
      });
    },

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Book returned successfully!",
      });

      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Failed to return book",
        variant: "destructive",
      });
    },
  });
};
