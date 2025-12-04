import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { truncate } from "@/utlis/helperFunctions";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Book, Borrowing } from "@/types/library";

interface BookCardProps {
  book: Book;                    
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
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-muted relative overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-[160px] object-fill"
        />
      </div>

      <CardContent className="p-4 space-y-3">

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
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Borrowed:</span>
              <span>{new Date(borrowing.borrowDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Due:</span>
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
            <p>ISBN: {book.isbn}</p>
            <p>Year: {book.publishedYear}</p>
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
              {mutationBorrow ? "Borrowing..." : book.isAvailable==false?'Checked Out':"Borrow Book"}
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
              {disableReturn ? "Returned" : "Return Book"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
