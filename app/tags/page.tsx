"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowLeft } from "lucide-react"
import { TagList } from "@/components/tag-list"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

export default function TagsPage() {
  const router = useRouter()
  const { addTag } = useStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [color, setColor] = useState("bg-blue-500")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        title: "请输入标签名称",
        variant: "destructive",
      })
      return
    }

    addTag({ name, color })
    toast({
      title: "标签已创建",
      description: "您的标签已成功保存",
    })
    setName("")
    setOpen(false)
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" size={20} />
              创建新标签
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>创建新标签</DialogTitle>
                <DialogDescription>创建一个新标签来组织您的记录。</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">标签名称</Label>
                  <Input id="name" placeholder="输入标签名称" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
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
              </div>
              <DialogFooter>
                <Button type="submit">保存</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>我的标签</CardTitle>
        </CardHeader>
        <CardContent>
          <TagList />
        </CardContent>
      </Card>
    </div>
  )
}

