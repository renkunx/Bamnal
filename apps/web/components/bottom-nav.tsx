"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, User } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export function BottomNav() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  // 如果是认证页面，不显示底部导航
  if (pathname.startsWith("/auth")) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
      <div className="container mx-auto flex justify-around items-center h-16">
        <Link href="/" className={`flex flex-col items-center ${pathname === "/" ? "text-primary" : "text-gray-500"}`}>
          <Home size={22} />
          <span className="text-xs mt-1">主页</span>
        </Link>
        <Link
          href="/records"
          className={`flex flex-col items-center ${pathname.startsWith("/records") ? "text-primary" : "text-gray-500"}`}
        >
          <BookOpen size={22} />
          <span className="text-xs mt-1">记录</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center ${pathname === "/profile" ? "text-primary" : "text-gray-500"}`}
        >
          <User size={22} />
          <span className="text-xs mt-1">我的</span>
        </Link>
      </div>
    </nav>
  )
}

