"use client"

import { useEffect, useState, use } from "react"
import { useStore, type Record } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, FileText, ImageIcon, DollarSign, Ruler } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { TimeDisplay } from "@/components/time-display"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MeasurementChart } from "@/components/measurement-chart"

export default function RecordDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { records, tags, deleteRecord } = useStore()
  const [record, setRecord] = useState<Record | null>(null)
  const [tag, setTag] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [similarRecords, setSimilarRecords] = useState<Record[]>([])
  const id = use(params).id

  useEffect(() => {
    const foundRecord = records.find((r) => r.id === id)
    if (foundRecord) {
      setRecord(foundRecord)
      const foundTag = tags.find((t) => t.id === foundRecord.tagId)
      setTag(foundTag)

      // Find similar records (same tag and measurement type)
      if (foundRecord.type === "measurement") {
        const similar = records
          .filter(
            (r) =>
              r.tagId === foundRecord.tagId &&
              r.type === "measurement" &&
              r.measurementType === foundRecord.measurementType,
          )
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

        setSimilarRecords(similar)
      }
    } else {
      router.push("/records")
    }
  }, [id, records, tags, router])

  const handleDelete = () => {
    if (record) {
      deleteRecord(record.id)
      router.push("/records")
    }
  }

  if (!record || !tag) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-6 w-6 text-blue-600" />
      case "image":
        return <ImageIcon className="h-6 w-6 text-purple-600" />
      case "expense":
        return <DollarSign className="h-6 w-6 text-green-600" />
      case "measurement":
        return <Ruler className="h-6 w-6 text-amber-600" />
      default:
        return <FileText className="h-6 w-6 text-gray-600" />
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "text":
        return "bg-blue-100"
      case "image":
        return "bg-purple-100"
      case "expense":
        return "bg-green-100"
      case "measurement":
        return "bg-amber-100"
      default:
        return "bg-gray-100"
    }
  }

  const getRecordTypeName = (type: string) => {
    switch (type) {
      case "text":
        return "文本"
      case "image":
        return "图片"
      case "expense":
        return "开销"
      case "measurement":
        return "测量"
      default:
        return "未知"
    }
  }

  const renderContent = () => {
    switch (record.type) {
      case "text":
        return <div className="whitespace-pre-wrap">{record.content}</div>
      case "image":
        return (
          <div className="space-y-4">
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={record.imageUrl || `/placeholder.svg?height=256&width=512&text=${record.title}`}
                alt={record.title}
                fill
                className="object-cover"
              />
            </div>
            {record.content && <div className="whitespace-pre-wrap">{record.content}</div>}
          </div>
        )
      case "expense":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg">
              <span className="text-3xl font-bold text-green-600">¥{record.amount}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-50 text-green-700">金额: ¥{record.amount}</Badge>
              {record.category && (
                <Badge className="bg-blue-50 text-blue-700">分类: {getCategoryName(record.category)}</Badge>
              )}
            </div>
            {record.content && (
              <div>
                <p className="text-sm text-gray-500">备注</p>
                <p>{record.content}</p>
              </div>
            )}
          </div>
        )
      case "measurement":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center p-6 bg-blue-50 rounded-lg">
              <span className="text-3xl font-bold text-blue-600">
                {record.measurementValue} {record.measurementUnit}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-amber-50 text-amber-700">
                测量类型: {getMeasurementTypeName(record.measurementType)}
              </Badge>
              <Badge className="bg-blue-50 text-blue-700">
                数值: {record.measurementValue} {record.measurementUnit}
              </Badge>
            </div>
            {similarRecords.length > 1 && (
              <div>
                <h3 className="text-lg font-medium mb-2">历史趋势</h3>
                <div className="h-64">
                  <MeasurementChart data={similarRecords} unit={record.measurementUnit || ""} />
                </div>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const getCategoryName = (category?: string) => {
    const categories: Record<string, string> = {
      food: "食品",
      transport: "交通",
      entertainment: "娱乐",
      shopping: "购物",
      other: "其他",
    }
    return category ? categories[category] || category : "未分类"
  }

  const getMeasurementTypeName = (type?: string) => {
    const types: Record<string, string> = {
      height: "身高",
      weight: "体重",
      temperature: "体温",
      other: "其他",
    }
    return type ? types[type] || type : "未知"
  }

  const borderColorClass =
    record.type === "text"
      ? "border-l-blue-500"
      : record.type === "image"
        ? "border-l-purple-500"
        : record.type === "expense"
          ? "border-l-green-500"
          : "border-l-amber-500"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="p-0">
          <ArrowLeft className="mr-2" /> 返回
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/records/edit/${record.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> 编辑
          </Button>
          <Button variant="outline" size="sm" className="text-red-500" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> 删除
          </Button>
        </div>
      </div>

      <Card className={`border-l-4 ${borderColorClass}`}>
        <CardHeader className="flex flex-row items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full ${getRecordTypeColor(record.type)} flex items-center justify-center flex-shrink-0`}
          >
            {getRecordIcon(record.type)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{record.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gray-50 text-gray-700 tag-badge">{getRecordTypeName(record.type)}</Badge>
                  <TimeDisplay date={record.createdAt} />
                </div>
              </div>
              <span className={`tag-badge ${tag.color} text-white`}>{tag.name}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>您确定要删除这条记录吗？此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

