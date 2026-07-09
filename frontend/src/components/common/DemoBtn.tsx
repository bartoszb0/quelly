import { DEMO_CREDENTIALS } from "@/constants/demoAccount";
import { toastApiError } from "@/lib/toastApiError";
import type { LoginInput } from "@/schemas/loginSchema";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export default function DemoBtn({
  logIn,
  isSubmitting,
  isDemoPending,
  setIsDemoPending,
}: {
  logIn: (values: LoginInput) => Promise<void>;
  isSubmitting: boolean;
  isDemoPending: boolean;
  setIsDemoPending: (isPending: boolean) => void;
}) {
  const { t } = useTranslation("auth");

  const onDemoClick = async () => {
    setIsDemoPending(true);
    try {
      await logIn(DEMO_CREDENTIALS);
    } catch (e) {
      toastApiError(e, { 401: t("errors.demoUnavailable") });
    } finally {
      setIsDemoPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onDemoClick}
      disabled={isSubmitting || isDemoPending}
    >
      {isDemoPending ? t("demoLoggingIn") : t("tryDemo")}
    </Button>
  );
}
