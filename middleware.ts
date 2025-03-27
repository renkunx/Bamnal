import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has("auth-token")

  // 允许访问 public 目录下的资源
  // if (pathname.startsWith("/_next") || pathname.startsWith("/images") || pathname.startsWith("/favicon.ico")) {
  //   return NextResponse.next()
  // }

  // 需要认证的路径
  const authRequiredPaths = ["/records", "/stats", "/settings"]
  const isAuthRequired = authRequiredPaths.some((path) => pathname.startsWith(path))

  // 如果路径需要认证但用户未登录，重定向到登录页
  if (isAuthRequired && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 如果用户已登录但访问登录/注册页，重定向到首页
  if (isAuthenticated && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (浏览器图标)
     * - images (图片资源)
     * - manifest (manifest.json)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|manifest).*)",
  ],
}

