import {  useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-background)] -z-10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
                  
                      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)]" />
            <span className="text-xl font-bold">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

                     {/* Main content */}

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8 backdrop-blur-sm border border-border/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-accent/50 border border-border">
                <h2 className="text-xl font-semibold mb-2">🎉 You're logged in!</h2>
                <p className="text-muted-foreground">
                  Your authentication system is working perfectly. You can now start building your application.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Profile Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Security</h3>
                  <p className="text-sm text-muted-foreground">Update your password and security settings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
