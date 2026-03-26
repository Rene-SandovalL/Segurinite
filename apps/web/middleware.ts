import { NextRequest, NextResponse } from "next/server";

function esRutaProtegida(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/groups");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tieneAccessToken = Boolean(request.cookies.get("access_token")?.value);

  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (esRutaProtegida(pathname) && !tieneAccessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
