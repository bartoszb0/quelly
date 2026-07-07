import { signIn } from "@/api/auth";
import AdminPanelLogo from "@/components/common/AdminPanelLogo";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastApiError } from "@/lib/toastApiError";
import { loginSchema, type LoginInput } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      const user = await signIn(values);
      queryClient.setQueryData(["me"], user);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      toastApiError(e, { 401: t("errors.invalidCredentials") });
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <AdminPanelLogo />
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isSubmitting}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-left text-destructive">
                      {t(errors.email.message ?? "")}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-left text-destructive">
                      {t(errors.password.message ?? "")}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            form="login-form"
            className="w-full"
            disabled={isSubmitting}
          >
            {t("logIn")}
          </Button>
          <Link
            to="/register"
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
          >
            {t("createAccount")}
          </Link>
        </CardFooter>
      </Card>
      <LanguageSwitcher />
    </div>
  );
}
