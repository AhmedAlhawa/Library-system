import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, Home, LibraryBig, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLang } from '@/hooks/useLang';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { useLanguageDropdown } from '@/hooks/useLanguageDropdown';
import { useState, useEffect } from 'react';
import { useBorrowedCount } from "@/hooks/library/useBorrowedCount";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { lang } = useLang();
  const { LanguageDropdown } = useLanguageDropdown();
  const { t } = useTranslation();
const borrowedCount = useBorrowedCount();

  // --- Mobile Nav State ---
  const [activeMobileNav, setActiveMobileNav] = useState("/");

  // Sync active state with route on navigation
  useEffect(() => {
    setActiveMobileNav(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => activeMobileNav === path;

  return (
    <div className={`min-h-screen bg-background ${lang === 'ar' ? 'direction-rtl' : ''}`}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="h-6 w-6 text-primary" />
              {!isMobile && <span>{t('library_system')}</span>}
            </Link>

            {/* ====== DESKTOP NAV ====== */}
            {!isMobile && (
              <nav className="flex items-center gap-6">
                <Link
                  to="/"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  {t('home')}
                </Link>

                <Link
                  to="/my-books"
                  className={`relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/my-books') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div className="relative">
                    <LibraryBig className="h-4 w-4" />

                    {borrowedCount > 0 && (
                      <span className="
                        absolute -top-2 -right-1 
                        bg-red-600 text-white
                        text-[10px] font-bold 
                        w-4 h-4 flex items-center justify-center 
                        rounded-full shadow
                      ">
                        {borrowedCount}
                      </span>
                    )}
                  </div>

                  {t("my_books")}
                </Link>
                
              </nav>
            )}

            {/* ====== MOBILE NAV (Dropdown) ====== */}
            {isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger className="px-3 py-2 gap-2 flex border rounded-md text-sm font-medium">
                  {activeMobileNav === "/"
                    ? t("home")
                    : activeMobileNav === "/my-books"
                    ? t("my_books")
                    : t("home")}
                      <ChevronDown className="h-4 w-4 opacity-70" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveMobileNav("/");
                      navigate("/");
                    }}
                    className={isActive("/") ? "text-primary font-semibold" : ""}
                  >
                    {t("home")}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      setActiveMobileNav("/my-books");
                      navigate("/my-books");
                    }}
                    className={isActive("/my-books") ? "text-primary font-semibold" : ""}
                  >
                      {t("my_books")}
                          {borrowedCount > 0 && (
                            <span className="ml-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                              {borrowedCount}
                            </span>
                          )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            <LanguageDropdown />
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">{children}</main>
    </div>
  );
};

export default Layout;
