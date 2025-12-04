import { Book, Borrowing } from "@/types/library";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { BookOpen, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { truncate } from "@/utlis/helperFunctions";
import BookCard from "@/components/BookCard";

interface BorrowingWithBook extends Borrowing {
  book?: Book;
}
const MyBooks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  console.log('isMobile : ',isMobile)

  //  Fetch borrowings for this user
  const borrowingsQuery = useQuery({
    queryKey: ["borrowings", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await axios.get(`http://localhost:4000/borrowings?userId=${user.id}`);

      // fetch each book info
      const borrowingsWithBooks = await Promise.all(
        data.map(async (borrowing: Borrowing) => {
          const bookRes = await axios.get(`http://localhost:4000/books/${borrowing.bookId}`);
          return { ...borrowing, book: bookRes.data };
        })
      );

      return borrowingsWithBooks as BorrowingWithBook[];
    },
    enabled: !!user,
  });

  const isLoading = borrowingsQuery.isLoading;
  const borrowings = borrowingsQuery.data || [];

  //  Handle return book mutation
  const returnBookMutation = useMutation({
    mutationFn: async (borrowing: BorrowingWithBook) => {
      // patch borrowing entry
      await axios.patch(`http://localhost:4000/borrowings/${borrowing.id}`, {
        returnDate: new Date().toISOString().split("T")[0],
        status: "returned",
      });
      // delete the book from borrowings
      await axios.delete(`http://localhost:4000/borrowings/${borrowing.id}`)

      // mark book as available again
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
      queryClient.invalidateQueries({ queryKey: ["borrowings", user?.id] });
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Failed to return book",
        variant: "destructive",
      });
    },
  });

  const handleReturn = (borrowing: BorrowingWithBook) => {
    returnBookMutation.mutate(borrowing);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading your books...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg md:text-2xl  font-bold tracking-tight mb-2">My Borrowed Books</h1>
        <p className=" text-muted-foreground">
          Manage your currently borrowed books and return them when done.
        </p>
      </div>

      {borrowings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-md md:text-lg font-semibold mb-2">No borrowed books</h3>
            <p className="text-muted-foreground text-center">
              You haven't borrowed any books yet. Start exploring the library!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container">
          {borrowings.map((borrowing) => (
            <BookCard
              key={borrowing.id}
              book={borrowing.book}
              isBorrowedView
              borrowing={borrowing}
              onReturn={() => handleReturn(borrowing)}
              disableReturn={borrowing.status === "returned"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
