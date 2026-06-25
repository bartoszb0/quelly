import type { LoginInput } from "@/schemas/loginSchema";
import type { RegisterInput } from "@/schemas/registerSchema";
import { api } from "./client";

export const signIn = async (body: LoginInput) => {
  const res = await api.post("/auth/login", body);
  return res.data;
};

export const signUp = async (body: RegisterInput) => {
  const res = await api.post("/auth/register", body);
  return res.data;
};

export const signOut = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
