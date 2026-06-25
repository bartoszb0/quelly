import type { LoginInput } from "@/schemas/loginSchema";
import type { RegisterInput } from "@/schemas/registerSchema";
import type { Me } from "@/types/Me";
import { api } from "./client";

export const signIn = async (body: LoginInput): Promise<Me> => {
  const res = await api.post<Me>("/auth/login", body);
  return res.data;
};

export const signUp = async (body: RegisterInput): Promise<Me> => {
  const res = await api.post<Me>("/auth/register", body);
  return res.data;
};

export const signOut = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getMe = async (): Promise<Me> => {
  const res = await api.get<Me>("/auth/me");
  return res.data;
};
