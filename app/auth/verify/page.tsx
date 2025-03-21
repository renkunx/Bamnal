"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">验证您的邮箱</CardTitle>
          <CardDescription>请查看您的邮箱以完成注册</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-4">
          <div className="mb-4 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">验证邮件已发送</h3>
          <p className="text-gray-500 mb-4">我们已向您的邮箱发送了一封验证邮件。请点击邮件中的链接完成注册。</p>
          <p className="text-sm text-gray-500 mb-4">没有收到邮件? 请检查您的垃圾邮件文件夹，或稍后再试。</p>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button asChild className="w-full">
            <Link href="/auth/login">返回登录</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

