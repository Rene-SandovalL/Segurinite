import { apiFetch } from "./client";

export interface LoginAdminPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SesionAdmin {
  id: string;
  email: string;
  rol: "ADMIN";
}

export async function loginAdmin(payload: LoginAdminPayload): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshSesionAdmin(): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>("/auth/refresh", {
    method: "POST",
  });
}

export async function getSesionAdmin(): Promise<SesionAdmin> {
  return apiFetch<SesionAdmin>("/auth/me");
}

export async function logoutAdmin(): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>("/auth/logout", {
    method: "POST",
  });
}
