import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { TagList } from "@/components/tag-list"

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">标签管理</h1>
        <Button>
          <PlusCircle className="mr-2" size={20} />
          创建新标签
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>我的标签</CardTitle>
        </CardHeader>
        <CardContent>
          <TagList />
        </CardContent>
      </Card>
    </div>
  )
}

