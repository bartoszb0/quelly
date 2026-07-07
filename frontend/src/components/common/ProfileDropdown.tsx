import { signOut } from "@/api/auth";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { toastApiError } from "@/lib/toastApiError";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Check, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LANGUAGE_LABELS: Record<string, string> = {
  pl: "Polski",
  en: "English",
};

export default function ProfileDropdown() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      queryClient.clear();
      navigate("/login", { replace: true });
    } catch (e) {
      toastApiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {t("language")}
          </DropdownMenuLabel>
          {SUPPORTED_LANGUAGES.map((lng) => (
            <DropdownMenuItem
              key={lng}
              className="hover:cursor-pointer"
              onClick={() => i18n.changeLanguage(lng)}
            >
              <Check
                className={cn(
                  "size-4",
                  i18n.resolvedLanguage === lng ? "opacity-100" : "opacity-0",
                )}
              />
              {LANGUAGE_LABELS[lng]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-destructive hover:cursor-pointer"
            disabled={isLoading}
            onClick={handleLogout}
          >
            {t("logOut")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
