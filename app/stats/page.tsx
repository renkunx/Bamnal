"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore, type Record } from "@/lib/store"
import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { TimeDisplay } from "@/components/time-display"

export default function StatsPage() {
  const router = useRouter()
  const { records, tags } = useStore()
  const [activeTab, setActiveTab] = useState("weekly")
  const [recordsByDate, setRecordsByDate] = useState<any[]>([])
  const [recordsByTag, setRecordsByTag] = useState<any[]>([])
  const [recordsByType, setRecordsByType] = useState<any[]>([])
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([])

  useEffect(() => {
    // 按日期统计记录
    const getDateRange = () => {
      const today = new Date()

      switch (activeTab) {
        case "weekly":
          return Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i))
        case "monthly":
          const start = startOfMonth(today)
          const end = endOfMonth(today)
          return eachDayOfInterval({ start, end })
        case "yearly":
          return Array.from({ length: 12 }, (_, i) => {
            const date = new Date(today.getFullYear(), i, 1)
            return date
          })
        default:
          return Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i))
      }
    }

    const dateRange = getDateRange()

    const dateData = dateRange.map((date) => {
      const dateStr = activeTab === "yearly" ? format(date, "yyyy-MM") : format(date, "yyyy-MM-dd")

      const count = records.filter((record) => {
        const recordDate =
          activeTab === "yearly"
            ? format(new Date(record.createdAt), "yyyy-MM")
            : format(new Date(record.createdAt), "yyyy-MM-dd")
        return recordDate === dateStr
      }).length

      return {
        date:
          activeTab === "yearly"
            ? format(date, "M月", { locale: zhCN })
            : format(date, activeTab === "weekly" ? "E" : "d日", { locale: zhCN }),
        count,
      }
    })

    setRecordsByDate(dateData)

    // 按标签统计记录
    const tagData = tags
      .map((tag) => {
        const count = records.filter((record) => record.tagId === tag.id).length
        return {
          name: tag.name,
          value: count,
          color: tag.color.replace("bg-", ""),
        }
      })
      .filter((item) => item.value > 0)

    setRecordsByTag(tagData)

    // 按类型统计记录
    const typeMap: Record<string, { name: string; value: number; color: string }> = {
      text: { name: "文本", value: 0, color: "blue-500" },
      image: { name: "图片", value: 0, color: "purple-500" },
      expense: { name: "开销", value: 0, color: "green-500" },
      measurement: { name: "测量", value: 0, color: "amber-500" },
    }

    records.forEach((record) => {
      if (typeMap[record.type]) {
        typeMap[record.type].value++
      }
    })

    setRecordsByType(Object.values(typeMap).filter((item) => item.value > 0))

    // 按支出分类统计
    const expenseRecords = records.filter((record) => record.type === "expense")
    const categoryMap: Record<string, { name: string; value: number; color: string }> = {
      food: { name: "食品", value: 0, color: "red-500" },
      transport: { name: "交通", value: 0, color: "blue-500" },
      entertainment: { name: "娱乐", value: 0, color: "purple-500" },
      shopping: { name: "购物", value: 0, color: "pink-500" },
      other: { name: "其他", value: 0, color: "gray-500" },
    }

    expenseRecords.forEach((record) => {
      const category = record.category || "other"
      if (categoryMap[category]) {
        categoryMap[category].value += record.amount || 0
      } else {
        categoryMap.other.value += record.amount || 0
      }
    })

    setExpensesByCategory(Object.values(categoryMap).filter((item) => item.value > 0))
  }, [records, tags, activeTab])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="p-0">
          <ArrowLeft className="mr-2" /> 返回
        </Button>
        <h1 className="text-2xl font-bold">数据统计</h1>
      </div>

      <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="weekly">本周</TabsTrigger>
          <TabsTrigger value="monthly">本月</TabsTrigger>
          <TabsTrigger value="yearly">全年</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>记录数量趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recordsByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} 条记录`, "数量"]} labelFormatter={(label) => `${label}`} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>标签分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recordsByTag}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {recordsByTag.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--${entry.color}))`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} 条记录`, "数量"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>记录类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recordsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {recordsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--${entry.color}))`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} 条记录`, "数量"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>支出分类统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--${entry.color}))`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`¥${value}`, "金额"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

