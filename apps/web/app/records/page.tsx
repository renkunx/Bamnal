"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, Plus, FileText, ImageIcon, DollarSign, Ruler, Trash2 } from "lucide-react"
import Image from "next/image"
import { useStore, type Record as RecordType } from "@/lib/store"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Button } from "@/components/ui/button"
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
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function RecordsPage() {
  const { records, tags, deleteRecord } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredRecords, setFilteredRecords] = useState<RecordType[]>([])
  const [groupedRecords, setGroupedRecords] = useState<{ [key: string]: RecordType[] }>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    // Filter records based on search term and active tab
    const filtered = records
      .filter(
        (record) =>
          (activeTab === "all" || tags.find((t) => t.id === record.tagId)?.name === activeTab) &&
          (record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(record.measurementValue).includes(searchTerm)),
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredRecords(filtered)

    // Group records by date
    const grouped: { [key: string]: RecordType[] } = {}
    filtered.forEach((record) => {
      const date = format(new Date(record.createdAt), "yyyy-MM-dd")
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(record)
    })

    setGroupedRecords(grouped)
  }, [records, tags, activeTab, searchTerm])

  const getTagForRecord = (record: RecordType) => {
    return tags.find((t) => t.id === record.tagId)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteRecord(deleteId)
      setDeleteId(null)
    }
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-purple-600" />
      case "expense":
        return <DollarSign className="h-5 w-5 text-green-600" />
      case "measurement":
        return <Ruler className="h-5 w-5 text-amber-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
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

  const hasImage = (record: RecordType) => {
    return record.type === "image" || record.imageUrl
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="搜索记录..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex overflow-x-auto mb-4 pb-1">
          <TabsTrigger value="all">全部</TabsTrigger>
          {tags.map((tag) => (
            <TabsTrigger key={tag.id} value={tag.name}>
              {tag.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-8">
        {Object.keys(groupedRecords).length > 0 ? (
          Object.keys(groupedRecords)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map((date) => {
              // Check if date is today
              const isToday = new Date(date).toDateString() === new Date().toDateString()
              const displayDate = isToday ? "今天" : format(new Date(date), "yyyy年MM月dd日 EEEE", { locale: zhCN })

              return (
                <div key={date} className="relative">
                  <div className="sticky top-0 z-10 bg-gray-50 py-2 px-4 rounded-lg mb-4 shadow-sm">
                    <h3 className="font-medium text-gray-700">{displayDate}</h3>
                  </div>

                  <div className="relative pl-8 border-l-2 border-gray-200 ml-4">
                    {groupedRecords[date].map((record) => {
                      const tag = getTagForRecord(record)
                      const borderColorClass =
                        record.type === "text"
                          ? "border-l-blue-500"
                          : record.type === "image"
                            ? "border-l-purple-500"
                            : record.type === "expense"
                              ? "border-l-green-500"
                              : "border-l-amber-500"

                      return (
                        <div key={record.id} className="mb-6 relative">
                          {/* Timeline dot */}
                          <div
                            className={`absolute -left-6 w-10 h-10 rounded-full ${getRecordTypeColor(record.type)} flex items-center justify-center z-10 border-2 border-white shadow-sm`}
                          >
                            {getRecordIcon(record.type)}
                          </div>

                          {/* Time */}
                          <div className="absolute -left-32 top-2 w-24 text-right text-sm text-gray-500 hidden md:block">
                            {format(new Date(record.createdAt), "HH:mm", { locale: zhCN })}
                          </div>

                          <Card className={`ml-6 overflow-hidden card-hover border-l-4 ${borderColorClass}`}>
                            <CardContent className="p-0">
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-medium">{record.title}</h3>
                                  {tag && <span className={`tag-badge ${tag.color} text-white`}>{tag.name}</span>}
                                </div>

                                <div className="text-sm text-gray-500 mb-2">
                                  {format(new Date(record.createdAt), "HH:mm", { locale: zhCN })}
                                </div>

                                {record.type === "expense" && (
                                  <div className="mb-2">
                                    <Badge className="bg-green-50 text-green-700 mr-2">¥{record.amount}</Badge>
                                    {record.category && (
                                      <Badge className="bg-blue-50 text-blue-700">
                                        {record.category === "food"
                                          ? "食品"
                                          : record.category === "transport"
                                            ? "交通"
                                            : record.category === "entertainment"
                                              ? "娱乐"
                                              : record.category === "shopping"
                                                ? "购物"
                                                : "其他"}
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                {record.type === "measurement" && (
                                  <div className="mb-2">
                                    <Badge className="bg-amber-50 text-amber-700 mr-2">
                                      {record.measurementType === "height"
                                        ? "身高"
                                        : record.measurementType === "weight"
                                          ? "体重"
                                          : record.measurementType === "temperature"
                                            ? "体温"
                                            : record.measurementType}
                                    </Badge>
                                    <Badge className="bg-blue-50 text-blue-700">
                                      {record.measurementValue} {record.measurementUnit}
                                    </Badge>
                                  </div>
                                )}

                                {record.content && <p className="text-sm text-gray-700 mb-2">{record.content}</p>}
                              </div>

                              {hasImage(record) && (
                                <div className="w-full h-48 relative">
                                  <Image
                                    src={
                                      record.imageUrl || `/placeholder.svg?height=192&width=384&text=${record.title}`
                                    }
                                    alt={record.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}

                              <div className="flex border-t border-gray-100 divide-x">
                                <Link
                                  href={`/records/${record.id}`}
                                  className="flex-1 p-2 text-sm text-gray-600 flex items-center justify-center"
                                >
                                  <Calendar size={16} className="mr-1" /> 查看详情
                                </Link>
                                <button
                                  className="flex-1 p-2 text-sm text-red-500 flex items-center justify-center"
                                  onClick={() => setDeleteId(record.id)}
                                >
                                  <Trash2 size={16} className="mr-1" /> 删除记录
                                </button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
        ) : (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">未找到记录</h3>
            <p className="text-gray-500">尝试使用不同的搜索词或筛选条件</p>
          </div>
        )}
      </div>

      {/* Floating add button */}
      <Link href="/records/new">
        <Button className="fixed right-6 bottom-24 h-14 w-14 rounded-full shadow-lg bamboo-gradient">
          <Plus size={24} className="text-white" />
        </Button>
      </Link>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
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

