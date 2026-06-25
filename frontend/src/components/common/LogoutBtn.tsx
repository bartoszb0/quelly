import { signOut } from "@/api/auth";
import { toastApiError } from "@/lib/toastApiError";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function LogoutBtn() {
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
    <Button onClick={handleLogout} disabled={isLoading}>
      Logout
    </Button>
  );
}
