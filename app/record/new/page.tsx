"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewRecordPage() {
  const [recordType, setRecordType] = useState("text")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">创建新记录</h1>

      <Card>
        <CardHeader>
          <CardTitle>记录详情</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block mb-1">标签</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择标签" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xiaoming">小明</SelectItem>
                  <SelectItem value="xiaohong">小红</SelectItem>
                  <SelectItem value="expense">日常开销</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1">记录类型</label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择记录类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">文本</SelectItem>
                  <SelectItem value="number">数字</SelectItem>
                  <SelectItem value="image">图片</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1">标题</label>
              <Input placeholder="输入记录标题" />
            </div>

            {recordType === "text" && (
              <div>
                <label className="block mb-1">内容</label>
                <Textarea placeholder="输入记录内容" />
              </div>
            )}

            {recordType === "number" && (
              <div>
                <label className="block mb-1">数值</label>
                <Input type="number" placeholder="输入数值" />
              </div>
            )}

            {recordType === "image" && (
              <div>
                <label className="block mb-1">上传图片</label>
                <Input type="file" accept="image/*" />
              </div>
            )}

            <Button type="submit">保存记录</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

