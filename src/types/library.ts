export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  isAvailable: boolean;
  coverImage: string;
  publishedYear: number;
  category: string;
}

export interface Borrowing {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned' ;
}

export interface LibraryData {
  users: User[];
  books: Book[];
  borrowings: Borrowing[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
