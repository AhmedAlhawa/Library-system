import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import MyBooks from "./pages/MyBooks";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the proper one
import Layout from "./components/Layout";
import { TooltipProvider } from "./components/ui/tooltip";
import { useEffect, useState } from "react";
import ConnectionError from "./components/ConnectionError";

const queryClient = new QueryClient();

const App = () => {

  const [offline, setOffline] = useState(!navigator.onLine);
  
   useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (offline) return <ConnectionError />;

  return (
   <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
    <TooltipProvider>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout>
                <Index />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="/my-books" 
          element={
            <ProtectedRoute>
              <Layout>
                <MyBooks />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  </TooltipProvider>  
    </BrowserRouter>
  </QueryClientProvider>
)};

export default App;