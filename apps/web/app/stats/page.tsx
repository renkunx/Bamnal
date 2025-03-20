import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecordCountChart } from "@/components/record-count-chart"
import { TagDistributionChart } from "@/components/tag-distribution-chart"

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">数据统计</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>记录数量趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <RecordCountChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>标签分布</CardTitle>
          </CardHeader>
          <CardContent>
            <TagDistributionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

