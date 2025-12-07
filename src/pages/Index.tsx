import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Search } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import BookCard from "@/components/BookCard";
import { Book } from "@/types/library";
import { useBorrowBook } from "@/hooks/library/useBorrowBook";
import { useTranslation } from "react-i18next";
import { useLang } from "@/hooks/useLang";

const LIMIT = 8; // how many books per page

const Index = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { lang } = useLang();
  const borrowMutation = useBorrowBook();

  // pagination
  const [pageNumber, setPageNumber] = useState(1);

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"title" | "author" | "isbn">("title");

  /** FETCH PAGINATED BOOKS */
  const fetchBooks = () => {
    const start = (pageNumber - 1) * LIMIT;
    return axios.get(`http://localhost:4000/books?_start=${start}&_limit=${LIMIT}`);
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["books", pageNumber],
    queryFn: fetchBooks,
  });

  if (isError) {
    toast({
      title: "There is something wrong, please refresh and try again.",
    });
  }

  const normalize = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]/g, "");

  /** APPLY SEARCH FILTER TO PAGINATED RESULTS */
  const filteredBooks = data?.data?.filter((book: Book) => {
    if (!searchQuery.trim()) return true;
    return normalize(book[searchBy]).includes(normalize(searchQuery));
  });

  const handleBorrow = (bookId: string) => {
    if (!user) return;
    borrowMutation.mutate({ userId: user.id, bookId });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-background)] -z-10" />

      {/* Search Header */}
      <div className="my-6 container">
        <h1 className={`text-xl md:text-3xl font-bold mb-2 ${lang === "ar" ? "text-right" : ""}`}>
          {t("search_books")}
        </h1>
        <p className={`mb-3 ${lang === "ar" ? "text-right" : ""}`}>{t("search_description")}</p>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder={`${t("search_by")} ${t(searchBy)}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />

              <Select
                value={searchBy}
                onValueChange={(value: any) => setSearchBy(value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">{t("title")}</SelectItem>
                  <SelectItem value="author">{t("author")}</SelectItem>
                  <SelectItem value="isbn">{t("isbn")}</SelectItem>
                </SelectContent>
              </Select>

              <Button disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                {t("search")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="text-center py-12">{t("loading_books")}</div>
      ) : filteredBooks?.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4" />
          {t("no_books")}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container"
          dir={lang === "ar" ? "rtl" : ""}
        >
          {filteredBooks?.map((book: Book) => (
            <BookCard
              key={book.id}
              book={book}
              onBorrow={() => handleBorrow(book.id)}
              mutationBorrow={borrowMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="container flex justify-between items-center py-10">
        <Button
          variant="outline"
          disabled={pageNumber === 1}
          onClick={() => setPageNumber((p) => p - 1)}
        >
          {t("previous")}
        </Button>

        <span className="text-sm opacity-60">
          {t("page")} {pageNumber}
        </span>

        <Button
          variant="outline"
          disabled={data?.data?.length < LIMIT}
          onClick={() => setPageNumber((p) => p + 1)}
        >
          {t("next")}
        </Button>
      </div>

      {isFetching && <p className="text-center opacity-50">{t("loading_books")}...</p>}
    </div>
  );
};

export default Index;
