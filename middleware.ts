import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // 如果用户未登录且当前路径不是/auth/*，重定向到/auth/login
    if (!session && !req.nextUrl.pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // 如果用户已登录且当前路径是/auth/*，重定向到/
    if (session && req.nextUrl.pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // 出错时，允许请求继续，但不执行重定向
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

