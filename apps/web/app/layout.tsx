import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "竹节记 - 记录生活的每一刻",
  description: "一款高度可定制的生活记录工具",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <main className="container mx-auto px-4 py-8 pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}

