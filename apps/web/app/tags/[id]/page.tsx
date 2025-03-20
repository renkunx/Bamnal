"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"

export default function EditTagPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { tags, updateTag } = useStore()
  const [name, setName] = useState("")
  const [color, setColor] = useState("")

  useEffect(() => {
    const tag = tags.find((t) => t.id === params.id)
    if (tag) {
      setName(tag.name)
      setColor(tag.color)
    } else {
      router.push("/tags")
    }
  }, [params.id, tags, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        title: "请输入标签名称",
        variant: "destructive",
      })
      return
    }

    updateTag(params.id, { name, color })
    toast({
      title: "标签已更新",
      description: "您的标签已成功保存",
    })
    router.push("/tags")
  }

  const colors = [
    { value: "bg-blue-500", label: "蓝色" },
    { value: "bg-green-500", label: "绿色" },
    { value: "bg-red-500", label: "红色" },
    { value: "bg-yellow-500", label: "黄色" },
    { value: "bg-purple-500", label: "紫色" },
    { value: "bg-pink-500", label: "粉色" },
    { value: "bg-indigo-500", label: "靛蓝" },
    { value: "bg-gray-500", label: "灰色" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="p-0">
          <ArrowLeft className="mr-2" /> 返回
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>编辑标签</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">标签名称</Label>
              <Input id="name" placeholder="输入标签名称" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>标签颜色</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`w-8 h-8 rounded-full ${c.value} ${color === c.value ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    onClick={() => setColor(c.value)}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                取消
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

