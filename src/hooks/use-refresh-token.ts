import { refreshToken } from "@/services/auth.service";
import { useEffect } from "react";

type RefreshTokenPayload = { refreshToken: string };
type LoginResponse = { token: string; refreshToken: string };

export function useAutoRefreshToken(intervalMs: number = 1 * 60 * 1000) {
  useEffect(() => {
    const id = setInterval(async () => {
      const storedRefresh = localStorage.getItem("refreshToken");
      if (!storedRefresh) return;

      try {
        const payload: RefreshTokenPayload = { refreshToken: storedRefresh };
        const data: LoginResponse = await refreshToken(payload);

        localStorage.setItem("token", data.token);
        if (data.refreshToken)
          localStorage.setItem("refreshToken", data.refreshToken);
        console.log(data);
      } catch (err) {
        console.error("Refresh token failed, logging out");

        localStorage.clear();
        window.location.href = "/login";
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);
}
