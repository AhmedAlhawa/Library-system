import { Book, Borrowing } from "@/types/library";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useQuery} from "@tanstack/react-query";
import BookCard from "@/components/BookCard";
import { useReturnBook } from "@/hooks/library/useReturnBook";
import { useTranslation } from "react-i18next";
import { useLang } from "@/hooks/useLang";

interface BorrowingWithBook extends Borrowing {
  book?: Book;
}
const MyBooks = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { lang } = useLang();

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
   const returnBookMutation = useReturnBook();

  const handleReturn = (borrowing: BorrowingWithBook) => {
    returnBookMutation.mutate(borrowing);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("loading_your_books")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${lang=='ar'?'text-right':''} gap-2`}>
        <h1 className="text-lg md:text-2xl font-bold tracking-tight mb-2 ">
          {t("my_borrowed_books")}
        </h1>

        <p className="text-muted-foreground">
          {t("manage_borrowed_description")}
        </p>

      </div>

      {borrowings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
           <h3 className="text-md md:text-lg font-semibold mb-2">
              {t("no_borrowed_books")}
            </h3>

            <p className="text-muted-foreground text-center">
              {t("no_borrowed_books_description")}
            </p>

          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
         container " dir={`${lang==='ar'?'rtl':''}`}>
          {borrowings
            .filter((b) => b.book) // remove undefined books
            .map((borrowing) => (
              <BookCard
                key={borrowing.id}
                book={borrowing.book!}
                isBorrowedView
                borrowing={borrowing}
                onReturn={() => handleReturn(borrowing)}
                disableReturn={borrowing.status === "returned"}
              />
            ))
          }

        </div>
      )}
    </div>
  );
};

export default MyBooks;
