"use client"

import type React from "react"
import { useEffect, useState, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, ImageIcon, DollarSign, Ruler, ArrowLeft } from "lucide-react"
import { useStore, type RecordType, type Record } from "@/lib/store"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/image-upload"

export default function EditRecordPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { records, tags, updateRecord } = useStore()
  const [record, setRecord] = useState<Record | null>(null)
  const [title, setTitle] = useState("")
  const [tagId, setTagId] = useState("")
  const [recordType, setRecordType] = useState<RecordType>("text")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [amount, setAmount] = useState<number | undefined>()
  const [category, setCategory] = useState("")
  const [measurementType, setMeasurementType] = useState("")
  const [measurementValue, setMeasurementValue] = useState<number | undefined>()
  const [measurementUnit, setMeasurementUnit] = useState("")
  const id = use(params).id

  useEffect(() => {
    const foundRecord = records.find((r) => r.id === id)
    if (foundRecord) {
      setRecord(foundRecord)
      setTitle(foundRecord.title)
      setTagId(foundRecord.tagId)
      setRecordType(foundRecord.type)
      setContent(foundRecord.content || "")
      setImageUrl(foundRecord.imageUrl || "")
      setAmount(foundRecord.amount)
      setCategory(foundRecord.category || "")
      setMeasurementType(foundRecord.measurementType || "")
      setMeasurementValue(foundRecord.measurementValue)
      setMeasurementUnit(foundRecord.measurementUnit || "")
    } else {
      router.push("/records")
    }
  }, [id, records, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      toast({
        title: "请输入标题",
        variant: "destructive",
      })
      return
    }

    if (!tagId) {
      toast({
        title: "请选择标签",
        variant: "destructive",
      })
      return
    }

    if (record) {
      updateRecord(record.id, {
        title,
        tagId,
        type: recordType,
        content,
        imageUrl,
        amount,
        category,
        measurementType,
        measurementValue,
        measurementUnit,
      })

      toast({
        title: "记录已更新",
        description: "您的记录已成功保存",
      })
      router.push(`/records/${record.id}`)
    }
  }

  if (!record) {
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
        <h1 className="text-2xl font-bold">编辑记录</h1>
      </div>

      <Tabs defaultValue={recordType} value={recordType} onValueChange={(value) => setRecordType(value as RecordType)}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="text" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> 文本
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center">
            <ImageIcon className="mr-2 h-4 w-4" /> 图片
          </TabsTrigger>
          <TabsTrigger value="expense" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" /> 开销
          </TabsTrigger>
          <TabsTrigger value="measurement" className="flex items-center">
            <Ruler className="mr-2 h-4 w-4" /> 测量
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>记录详情</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">标签</label>
                <Select value={tagId} onValueChange={setTagId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择标签" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">标题</label>
                <Input placeholder="输入记录标题" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <TabsContent value="text" className="mt-0 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">内容</label>
                  <Textarea
                    placeholder="输入记录内容"
                    className="min-h-[150px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="mt-0 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">图片</label>
                  <ImageUpload value={imageUrl} onChange={setImageUrl} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">描述</label>
                  <Textarea placeholder="输入图片描述" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
              </TabsContent>

              <TabsContent value="expense" className="mt-0 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">金额</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">¥</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={amount || ""}
                      onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">分类</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">食品</SelectItem>
                      <SelectItem value="transport">交通</SelectItem>
                      <SelectItem value="entertainment">娱乐</SelectItem>
                      <SelectItem value="shopping">购物</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">备注</label>
                  <Textarea placeholder="输入备注信息" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
              </TabsContent>

              <TabsContent value="measurement" className="mt-0 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">测量类型</label>
                  <Select value={measurementType} onValueChange={setMeasurementType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择测量类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="height">身高</SelectItem>
                      <SelectItem value="weight">体重</SelectItem>
                      <SelectItem value="temperature">体温</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">数值</label>
                  <Input
                    type="number"
                    placeholder="输入数值"
                    value={measurementValue || ""}
                    onChange={(e) => setMeasurementValue(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">单位</label>
                  <Select value={measurementUnit} onValueChange={setMeasurementUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择单位" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">厘米 (cm)</SelectItem>
                      <SelectItem value="kg">千克 (kg)</SelectItem>
                      <SelectItem value="celsius">摄氏度 (°C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <div className="pt-4 border-t flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  取消
                </Button>
                <Button type="submit">保存</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}

