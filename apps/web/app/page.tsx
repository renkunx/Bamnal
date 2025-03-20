import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RecentRecords } from "@/components/recent-records"
import { QuickStats } from "@/components/quick-stats"

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">欢迎回到竹节记</h1>

      <QuickStats />

      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/records/new">新建记录</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <RecentRecords />
    </div>
  )
}

