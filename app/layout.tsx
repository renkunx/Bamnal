import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"
import { Logo } from "@/components/logo"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "竹节记 - 记录生活的每一刻",
  description: "一款高度可定制的生活记录工具",
  icons: {
    icon: "/favicon.ico",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "r9lzb7em0k");
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex items-center">
              <Logo />
            </div>
          </header>
          <main className="container mx-auto px-4 py-6 pb-24">{children}</main>
          <BottomNav />
          <Toaster />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

