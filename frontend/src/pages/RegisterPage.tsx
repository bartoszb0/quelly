import { signUp } from "@/api/auth";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastApiError } from "@/lib/toastApiError";
import { registerSchema, type RegisterInput } from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function RegisterPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterInput) => {
    try {
      const user = await signUp(values);
      queryClient.setQueryData(["me"], user);
      toast.success(t("accountCreated"));
      navigate("/dashboard", { replace: true });
    } catch (e) {
      toastApiError(e, { 409: t("errors.emailTaken") });
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4 p-4">
      <Card className="w-full max-w-sm">
        <CardContent>
          <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
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
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">
                    {t("confirmPassword")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-left text-destructive">
                      {t(errors.confirmPassword.message ?? "")}
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
            form="register-form"
            className="w-full"
            disabled={isSubmitting}
          >
            {t("createAccount")}
          </Button>
          <Link
            to="/login"
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
          >
            {t("alreadyHaveAccount")}
          </Link>
        </CardFooter>
      </Card>
      <LanguageSwitcher />
    </div>
  );
}
