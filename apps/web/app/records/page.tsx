"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

const mockRecords = [
  { id: 1, title: "小明身高测量", tag: "小明", date: "2023-05-15", content: "身高增长到120cm" },
  { id: 2, title: "超市购物", tag: "日常开销", date: "2023-05-14", content: "购买日用品,共计￥150" },
  { id: 3, title: "小红学会骑自行车", tag: "小红", date: "2023-05-13", content: "今天小红终于学会骑自行车了!" },
  // ... 更多记录
]

export default function RecordsPage() {
  const [selectedTag, setSelectedTag] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRecords = mockRecords.filter(
    (record) =>
      (selectedTag === "all" || record.tag === selectedTag) &&
      (record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.content.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">我的记录</h1>
        <Button asChild>
          <Link href="/records/new">
            <PlusCircle className="mr-2" size={20} />
            新记录
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>筛选记录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger>
              <SelectValue placeholder="选择标签" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部标签</SelectItem>
              <SelectItem value="小明">小明</SelectItem>
              <SelectItem value="小红">小红</SelectItem>
              <SelectItem value="日常开销">日常开销</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="搜索记录..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id}>
            <CardHeader>
              <CardTitle>{record.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {record.date} - {record.tag}
              </p>
              <p className="mt-2">{record.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

