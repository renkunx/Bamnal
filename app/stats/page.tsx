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
  Area,
  AreaChart,
} from "recharts"
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart2, PieChartIcon, TrendingUp, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function StatsPage() {
  const router = useRouter()
  const { records, tags } = useStore()
  const [activeTab, setActiveTab] = useState("weekly")
  const [activeChartType, setActiveChartType] = useState("bar")
  const [recordsByDate, setRecordsByDate] = useState<any[]>([])
  const [recordsByTag, setRecordsByTag] = useState<any[]>([])
  const [recordsByType, setRecordsByType] = useState<any[]>([])
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [mostActiveTag, setMostActiveTag] = useState<string | null>(null)

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
        fill: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
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
      .sort((a, b) => b.value - a.value)

    setRecordsByTag(tagData)

    // 设置最活跃的标签
    if (tagData.length > 0) {
      setMostActiveTag(tagData[0].name)
    }

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

    let totalExp = 0
    expenseRecords.forEach((record) => {
      const category = record.category || "other"
      if (categoryMap[category]) {
        categoryMap[category].value += record.amount || 0
        totalExp += record.amount || 0
      } else {
        categoryMap.other.value += record.amount || 0
        totalExp += record.amount || 0
      }
    })

    setTotalExpenses(totalExp)
    setExpensesByCategory(Object.values(categoryMap).filter((item) => item.value > 0))
    setTotalRecords(records.length)
  }, [records, tags, activeTab])

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            {payload[0].name}: {payload[0].value} 条记录
          </p>
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">
            {payload[0].value} ({((payload[0].value / totalRecords) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomExpensesTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-green-600">
            ¥{payload[0].value} ({((payload[0].value / totalExpenses) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="p-0">
          <ArrowLeft className="mr-2" /> 返回
        </Button>
        <h1 className="text-2xl font-bold">数据统计</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center mb-2">
            <BarChart2 className="mr-2" />
            <h3 className="font-medium">总记录数</h3>
          </div>
          <p className="text-3xl font-bold">{totalRecords}</p>
          <p className="text-xs opacity-80 mt-1">全部记录总数</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center mb-2">
            <TrendingUp className="mr-2" />
            <h3 className="font-medium">总支出</h3>
          </div>
          <p className="text-3xl font-bold">¥{totalExpenses.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-1">全部支出总额</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center mb-2">
            <PieChartIcon className="mr-2" />
            <h3 className="font-medium">最活跃标签</h3>
          </div>
          <p className="text-3xl font-bold">{mostActiveTag || "无"}</p>
          <p className="text-xs opacity-80 mt-1">使用最多的标签</p>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="weekly" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> 本周
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> 本月
            </TabsTrigger>
            <TabsTrigger value="yearly" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> 全年
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button
            variant={activeChartType === "bar" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChartType("bar")}
          >
            <BarChart2 className="h-4 w-4 mr-1" /> 柱状图
          </Button>
          <Button
            variant={activeChartType === "area" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChartType("area")}
          >
            <TrendingUp className="h-4 w-4 mr-1" /> 面积图
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={chartVariants} initial="hidden" animate="visible">
          <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-primary" /> 记录数量趋势
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChartType === "bar" ? (
                    <BarChart data={recordsByDate} barSize={activeTab === "monthly" ? 12 : 24}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="count"
                        name="记录数"
                        fill="url(#colorCount)"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                    </BarChart>
                  ) : (
                    <AreaChart data={recordsByDate}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        name="记录数"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center">
                <PieChartIcon className="mr-2 h-5 w-5 text-blue-600" /> 标签分布
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={recordsByTag}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomizedLabel}
                      animationDuration={1500}
                      animationBegin={300}
                    >
                      {recordsByTag.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center">
                <PieChartIcon className="mr-2 h-5 w-5 text-purple-600" /> 记录类型分布
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={recordsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomizedLabel}
                      animationDuration={1500}
                      animationBegin={600}
                    >
                      {recordsByType.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center">
                <PieChartIcon className="mr-2 h-5 w-5 text-green-600" /> 支出分类统计
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomizedLabel}
                      animationDuration={1500}
                      animationBegin={900}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomExpensesTooltip />} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

