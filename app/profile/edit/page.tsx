"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { AvatarUpload } from "@/components/avatar-upload"
import { useProfileStore } from "@/lib/profile-service"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

export default function EditProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { profile, isLoading, fetchProfile, updateProfile } = useProfileStore()

  const [username, setUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [slogan, setSlogan] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    // 检查URL参数，判断是否是新用户
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      setIsNewUser(searchParams.get("new") === "true")
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user, fetchProfile])

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "")
      setAvatarUrl(profile.avatarUrl || "")
      setSlogan(profile.slogan || "")
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateProfile({
        username,
        avatarUrl,
        slogan,
      })

      toast({
        title: "个人信息已更新",
        description: "您的个人资料已成功保存",
      })

      router.push("/profile")
    } catch (error) {
      toast({
        title: "更新失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="p-0">
          <ArrowLeft className="mr-2" /> 返回
        </Button>
        <h1 className="text-2xl font-bold">编辑个人信息</h1>
      </div>

      {isNewUser && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">欢迎加入竹节记！</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>请完善您的个人信息，让我们更好地认识您。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>个人资料</CardTitle>
            <CardDescription>更新您的个人信息和头像</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <AvatarUpload initialImage={avatarUrl} onImageChange={setAvatarUrl} size="xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="请输入您的用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan">个性签名</Label>
              <Textarea
                id="slogan"
                placeholder="介绍一下自己吧..."
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSaving}>
              取消
            </Button>
            <Button type="submit" disabled={isSaving} className="flex items-center">
              {isSaving ? (
                <>保存中...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> 保存
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

