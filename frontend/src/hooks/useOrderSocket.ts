import { useEffect } from "react";
import { io } from "socket.io-client";

export function useOrderSocket(
  shopPublicId: string | undefined,
  enabled: boolean,
  onChange: () => void,
) {
  useEffect(() => {
    if (!enabled || !shopPublicId) return;
    const socket = io(import.meta.env.VITE_API_URL);
    socket.emit("joinShop", { shopPublicId });
    socket.on("queueChange", onChange);
    return () => {
      socket.disconnect();
    };
  }, [shopPublicId, enabled, onChange]);
}
