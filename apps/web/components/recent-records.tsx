import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentRecords = [
  { id: 1, title: "小明身高测量", tag: "小明", date: "2023-05-15" },
  { id: 2, title: "超市购物", tag: "日常开销", date: "2023-05-14" },
  { id: 3, title: "小红学会骑自行车", tag: "小红", date: "2023-05-13" },
]

export function RecentRecords() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近记录</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recentRecords.map((record) => (
            <li key={record.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{record.title}</p>
                <p className="text-sm text-gray-500">{record.date}</p>
              </div>
              <Badge>{record.tag}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

