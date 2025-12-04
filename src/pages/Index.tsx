import {  Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, LibraryBig, LogOut, Search, User } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { truncate } from "@/utlis/helperFunctions";
import BookCard from "@/components/BookCard";
import { Book } from "@/types/library";

const Index = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'title' | 'author' | 'isbn'>('title');

  const {data:books , isLoading , isError}=useQuery({
    queryKey:['books'],
    queryFn: ({queryKey})=>{
      return axios.get('http://localhost:4000/books')
    },
  });
  
const normalize = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, ""); 
// remove spaces, dashes, punctuation

const filteredBooks = books?.data?.filter((book: Book) => {
  if (!searchQuery.trim()) return true;

  const value = normalize(book[searchBy] || "");
  const query = normalize(searchQuery);

  return value.includes(query);
});

const queryClient = useQueryClient();

const borrowMutation = useMutation({
  mutationFn: async ({ userId, bookId }: { userId: string; bookId: string }) => {
    const borrowDate = new Date().toISOString().split("T")[0];
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const borrowRes = await axios.post("http://localhost:4000/borrowings", {
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

    return borrowRes.data;
  },
  onSuccess: () => {
    toast({
      title: "Success",
      description: "Book borrowed successfully!",
    });

    // Refresh book list
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
const handleBorrow = (bookId: string) => {
  if (!user) return;

  borrowMutation.mutate({
    userId: user.id,
    bookId: bookId,
  });
};


  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-background)] -z-10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
               
            {/* Main content */}
    <div className="my-6 container " >
        <h1 className="text-xl md:text-3xl font-bold tracking-tight mb-2 ">Search Books</h1>
        <p className="text-muted-foreground hidden md:block">
          Find and borrow books from our library collection
        </p>
        <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
             <div className="flex-1 relative">
              <Input
                placeholder={`Search by ${searchBy}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter'}
                className="w-full"
              />
            </div>
            </div>
            <Select 
            value={searchBy} 
            onValueChange={(value: any) => setSearchBy(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="isbn">ISBN</SelectItem>
              </SelectContent>
            </Select>
            <Button 
            // onClick={handleSearch} 
            disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading books...</p>
        </div>
      ) : filteredBooks?.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container">
          {filteredBooks?.map((book:Book) => (
           <BookCard
              key={book.id}
              book={book}
              onBorrow={() => handleBorrow(book.id)}
              mutationBorrow={borrowMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
