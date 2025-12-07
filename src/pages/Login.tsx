import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useLang } from "@/hooks/useLang";
import { useTranslation } from "react-i18next";
import { useLanguageDropdown } from "@/hooks/useLanguageDropdown";

const Login = () => {
  const { lang } = useLang();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { LanguageDropdown } = useLanguageDropdown();

  const loginSchema = z.object({
    email: z.string().email(t("invalid_email_address")),
    password: z.string().min(6, t("password_min_length") || "Password must be at least 6 characters"),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    const success = await login(data.email, data.password);
    setIsSubmitting(false);
    if (success) navigate("/");
  };

  // RTL if Arabic
  const isRtl = lang === "ar";

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${isRtl ? "text-right" : "text-left"}`}>
      <div className="absolute inset-0 bg-[image:var(--gradient-background)] -z-10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageDropdown />
        <ThemeToggle />
      </div>

      {/* Login card */}
      <div className="w-full max-w-md">
        <div
          className={`bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8 backdrop-blur-sm border border-border/50`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className={`mb-8 ${isRtl ? "text-right" : "text-center"}`}>
            <h1 className="text-3xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent text-center mb-2">
              {t("welcome_back")}
            </h1>
            <p className="text-muted-foreground text-center">{t("sign_in_to_continue") || "Sign in to your account to continue"}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email") || "Email"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("email_placeholder") || "john@example.com"}
                {...register("email")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className={`flex justify-between items-center ${isRtl ? "flex-row" : ""}`}>
                <Label htmlFor="password">{t("password") || "Password"}</Label>
                {/* <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  {t("forgot_password") || "Forgot password?"}
                </Link> */}
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t("password_placeholder") || "••••••••"}
                {...register("password")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-[image:var(--gradient-primary)] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("signing_in") || "Signing in..."}
                </>
              ) : (
                t("sign_in") || "Sign In"
              )}
            </Button>
          </form>

          <div className={`mt-6 text-sm text-center`}>
            <span className="text-muted-foreground">{t("dont_have_account") || "Don't have an account? "}</span>
            <Link to="/register" className="text-primary font-medium hover:underline transition-colors">
              {t("sign_up") || "Sign up"}
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50 text-xs text-muted-foreground text-center">
            {t("demo_credentials") || "Demo credentials: john@example.com / password123"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
