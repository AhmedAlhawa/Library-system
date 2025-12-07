import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { truncate } from "@/utils/helperFunctions";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Book, Borrowing } from "@/types/library";
import { useTranslation } from "react-i18next";
import { useLang } from "@/hooks/useLang";

interface BookCardProps {
  book?: Book;                    
  isBorrowedView?: boolean;      
  borrowing?: Borrowing;       
  onBorrow?: () => void;
  onReturn?: () => void;
  mutationBorrow?: boolean;
  disableReturn?: boolean;
}

export default function BookCard({
  book,
  isBorrowedView = false,
  borrowing,
  onBorrow,
  onReturn,
  mutationBorrow,
  disableReturn,
}: BookCardProps) {
  const { t } = useTranslation();
  const { lang } = useLang();
  if (!book) {
  return (
    <Card className="animate-pulse p-6">
      <div className="h-40 bg-muted mb-4"></div>
      <div className="h-4 bg-muted w-1/2 mb-2"></div>
      <div className="h-4 bg-muted w-1/3"></div>
    </Card>
  );
}

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-muted relative overflow-hidden">
        <img
          src={book?.coverImage}
          alt={book?.title}
          className="w-full h-[160px] object-fill"
        />
      </div>

      <CardContent className={`p-4 space-y-3 ${lang=='ar'?'text-right':''}`}>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="font-semibold line-clamp-2 mb-1 cursor-pointer">
                {truncate(book.title, 25)}
              </h3>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="max-w-xs">{book.title}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>

        {/* IF THIS IS MyBooks */}
        {isBorrowedView && borrowing && (
          <div className="space-y-2">
            <div className={`flex items-center ${lang=='ar'?'justify-start flex-row-reverse':''} gap-2 text-sm `}>
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("borrowed")}</span>
              <span>:</span>
              <span>{new Date(borrowing.borrowDate).toLocaleDateString()}</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${lang=='ar'?'justify-start flex-row-reverse':''}`}>
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("due")}</span>
              <span>:</span>
              <span
                className={
                  new Date(borrowing.dueDate) < new Date()
                    ? "text-destructive font-medium"
                    : ""
                }
              >
                {new Date(borrowing.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* If NORMAL BOOK CARD (from Index) */}
        {!isBorrowedView && (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              {t("isbn")} : 
              <span dir="ltr" className="inline-block ml-1">
                 {book.isbn}
              </span>
            </p>
            <p>{t("year")}: {book.publishedYear}</p>

            <Badge variant="outline">{book.category}</Badge>
          </div>
        )}

        <div className="pt-2">
          {/* Borrow Button */}
          {!isBorrowedView && (
            <Button
              onClick={onBorrow}
              className="w-full "
              size="sm"
              variant={book.isAvailable?'default':'secondary'}
              disabled={mutationBorrow || book.isAvailable==false }
            >
              {mutationBorrow ?  t("borrowing")  : book.isAvailable==false?t("checked_out"):t("borrow_book")}
            </Button>
          )}

          {/* Return Button */}
          {isBorrowedView && (
            <Button
              onClick={onReturn}
              className="w-full"
              size="sm"
              disabled={disableReturn}
              variant={disableReturn ? "secondary" : "default"}
            >
              {disableReturn ? t("returned") : t("return_book")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
