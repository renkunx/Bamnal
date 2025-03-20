import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>快速统计</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">15</p>
            <p className="text-sm text-gray-500">总记录数</p>
          </div>
          <div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-gray-500">活跃标签</p>
          </div>
          <div>
            <p className="text-2xl font-bold">7天</p>
            <p className="text-sm text-gray-500">连续记录</p>
          </div>
          <div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-gray-500">今日记录</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

