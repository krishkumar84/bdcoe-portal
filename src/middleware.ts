import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authOptions } from "./app/api/auth/[...nextauth]/option";
export { default } from "next-auth/middleware";
// export { auth as middleware } from "@/auth"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  const url = request.nextUrl;

  // console.log(token,"rvrgvr")

  const isAdmin : string | undefined = token ? (token as { role: string }).role : undefined;

  if (token && url.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  if (!token && url.pathname !== "/signin") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (!token && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (!token && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Redirect non-admin users trying to access admin routes
  if (isAdmin !== "admin" && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url)); // Or redirect to a not-authorized page
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin","/admin","/signup"],
};
