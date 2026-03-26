const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiHttpError";
  }
}

function apiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

async function obtenerCookieServidor(): Promise<string | undefined> {
  if (typeof window !== "undefined") {
    return undefined;
  }

  try {
    const headersModule = await import("next/headers");
    const cookieStore = await headersModule.cookies();
    const raw = cookieStore.toString();
    return raw || undefined;
  } catch {
    return undefined;
  }
}

async function manejarNoAutorizado(): Promise<void> {
  if (typeof window !== "undefined") {
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    return;
  }

  const navigationModule = await import("next/navigation");
  navigationModule.redirect("/login");
}

async function intentarRefresh(serverCookie?: string): Promise<boolean> {
  const headers = new Headers();

  if (serverCookie) {
    headers.set("cookie", serverCookie);
  }

  const response = await fetch(apiUrl("/auth/refresh"), {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers,
  });

  return response.ok;
}

async function apiFetchInterno<T>(
  path: string,
  init?: RequestInit,
  retryOnUnauthorized = true,
): Promise<T> {
  const headers = new Headers(init?.headers ?? {});

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const serverCookie = await obtenerCookieServidor();
  if (serverCookie && !headers.has("cookie")) {
    headers.set("cookie", serverCookie);
  }

  const response = await fetch(apiUrl(path), {
    cache: "no-store",
    credentials: "include",
    ...init,
    headers,
  });

  if (!response.ok) {
    let detalle = `Error API ${response.status} en ${path}`;

    try {
      const errorBody = (await response.json()) as
        | { message?: string | string[] }
        | undefined;

      if (Array.isArray(errorBody?.message)) {
        detalle = errorBody.message.join(", ");
      } else if (typeof errorBody?.message === "string" && errorBody.message.trim()) {
        detalle = errorBody.message;
      }
    } catch {
      // sin body JSON
    }

    if (
      response.status === 401 &&
      retryOnUnauthorized &&
      path !== "/auth/login" &&
      path !== "/auth/refresh"
    ) {
      const refrescado = await intentarRefresh(serverCookie);

      if (refrescado) {
        return apiFetchInterno<T>(path, init, false);
      }
    }

    if (response.status === 401) {
      await manejarNoAutorizado();
    }

    throw new ApiHttpError(detalle, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return apiFetchInterno<T>(path, init, true);
}
