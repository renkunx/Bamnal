"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, FileText, ImageIcon, DollarSign, Ruler } from "lucide-react"
import { useStore } from "@/lib/store"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

export function RecentRecords() {
  const { records, tags } = useStore()

  // Get the 3 most recent records
  const recentRecords = [...records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const getTagForRecord = (tagId: string) => {
    return tags.find((t) => t.id === tagId)
  }

  const hasImage = (record: any) => {
    return record.type === "image" || record.imageUrl
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">最近记录</CardTitle>
        <Link href="/records" className="text-sm text-primary flex items-center">
          查看全部 <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {recentRecords.length > 0 ? (
          <ul className="space-y-4">
            {recentRecords.map((record) => {
              const tag = getTagForRecord(record.tagId)
              return (
                <li
                  key={record.id}
                  className="flex items-start space-x-4 py-2 border-l-2 border-gray-200 pl-4 relative"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-2.5 w-5 h-5 rounded-full ${getRecordTypeColor(record.type)} flex items-center justify-center border border-white`}
                  >
                    {getRecordIcon(record.type)}
                  </div>

                  {hasImage(record) ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ml-2">
                      <Image
                        src={record.imageUrl || `/placeholder.svg?height=64&width=64&text=${record.title}`}
                        alt={record.title}
                        width={64}
                        height={64}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-lg ${getRecordTypeColor(record.type)} flex items-center justify-center flex-shrink-0 ml-2`}
                    >
                      {getRecordIcon(record.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{record.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(record.createdAt), "yyyy年MM月dd日", { locale: zhCN })}
                    </p>
                    {tag && <Badge className={`mt-1 ${tag.color} text-white`}>{tag.name}</Badge>}

                    {record.type === "expense" && (
                      <Badge className="mt-1 mr-1 bg-green-50 text-green-700">¥{record.amount}</Badge>
                    )}

                    {record.type === "measurement" && (
                      <Badge className="mt-1 bg-amber-50 text-amber-700">
                        {record.measurementValue} {record.measurementUnit}
                      </Badge>
                    )}
                  </div>
                  <Link href={`/records/${record.id}`}>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">暂无记录，开始创建您的第一条记录吧</p>
            <Button asChild className="mt-4">
              <Link href="/records/new">创建记录</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

