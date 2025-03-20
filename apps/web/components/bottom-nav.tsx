"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="container mx-auto flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center ${pathname === "/" ? "text-green-600" : "text-gray-600"}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">主页</span>
        </Link>
        <Link
          href="/records"
          className={`flex flex-col items-center ${pathname === "/records" ? "text-green-600" : "text-gray-600"}`}
        >
          <BookOpen size={24} />
          <span className="text-xs mt-1">记录</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center ${pathname === "/profile" ? "text-green-600" : "text-gray-600"}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">我的</span>
        </Link>
      </div>
    </nav>
  )
}

