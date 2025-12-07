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
import { useTranslation } from "react-i18next";
import { useLang } from "@/hooks/useLang";
import { useLanguageDropdown } from "@/hooks/useLanguageDropdown";

const Register = () => {
  const { lang } = useLang();
  const { t } = useTranslation();
  const { LanguageDropdown } = useLanguageDropdown();
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerSchema = z
    .object({
      name: z.string().min(2, t("name_min_length")),
      email: z.string().email(t("invalid_email_address")),
      password: z.string().min(6, t("password_min_length")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwords_dont_match"),
      path: ["confirmPassword"],
    });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    const success = await registerUser(data.name, data.email, data.password);
    setIsSubmitting(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
        lang === "ar" ? "direction-rtl" : ""
      }`}
    >
      <div className="absolute inset-0 bg-[image:var(--gradient-background)] -z-10" />

      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <LanguageDropdown />
        <ThemeToggle />
      </div>

      {/* Register card */}
      <div className="w-full max-w-md">
        <div className={"bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8 backdrop-blur-sm border border-border/50"}  dir={lang=="ar" ? "rtl" : "ltr"}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-2">
              {t("create_account")}
            </h1>
            <p className="text-muted-foreground">{t("sign_up_to_get_started")}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("full_name")}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("name_placeholder")}
                {...register("name")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("email_placeholder")}
                {...register("email")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("password_placeholder")}
                {...register("password")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirm_password")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("confirm_password_placeholder")}
                {...register("confirmPassword")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[image:var(--gradient-primary)] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("creating_account")}
                </>
              ) : (
                t("create_account")
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t("already_have_account")} </span>
            <Link
              to="/login"
              className="text-primary font-medium hover:underline transition-colors"
            >
              {t("sign_in")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
