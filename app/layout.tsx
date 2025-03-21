import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"
import { Logo } from "@/components/logo"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "竹节记 - 记录生活的每一刻",
  description: "一款高度可定制的生活记录工具",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex items-center">
              <Logo />
            </div>
          </header>
          <main className="container mx-auto px-4 py-6 pb-24">{children}</main>
          <BottomNav />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'