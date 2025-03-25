"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        toast({
          title: "登录失败",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "登录成功",
        description: "欢迎回到竹节记",
      })

      // 获取用户资料
      const supabase = getSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single()

        // 如果用户名为空，引导用户完善个人信息
        if (!profile || !profile.username) {
          router.push("/profile/edit?new=true")
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "登录失败",
        description: "发生未知错误，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 如果已经登录，直接跳转到首页
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 pt-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">登录竹节记</CardTitle>
          <CardDescription>输入您的账号信息登录</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  忘记密码？
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            还没有账号？
            <Link href="/auth/register" className="text-primary hover:underline ml-1">
              立即注册
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

