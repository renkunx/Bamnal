import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TagList } from "@/components/tag-list"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex items-center space-x-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder-avatar.jpg" alt="用户头像" />
            <AvatarFallback>用户</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">张三</h2>
            <p className="text-gray-500">用户ID: 12345</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>统计信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">150</p>
              <p className="text-sm text-gray-500">总记录数</p>
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-gray-500">活跃标签</p>
            </div>
            <div>
              <p className="text-2xl font-bold">30天</p>
              <p className="text-sm text-gray-500">连续记录</p>
            </div>
            <div>
              <p className="text-2xl font-bold">2023-01-01</p>
              <p className="text-sm text-gray-500">注册日期</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>我的标签</CardTitle>
          <Button asChild>
            <Link href="/tags/new">新建标签</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <TagList />
        </CardContent>
      </Card>
    </div>
  )
}

