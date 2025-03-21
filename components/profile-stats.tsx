import Image from "next/image"
import { Card } from "@/components/ui/card"

export function ProfileStats() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">从注册至今达成 5 个足迹</h1>

      {/* Milestone 500 */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="absolute left-0 top-6 w-2 h-2 rounded-full bg-green-400 -translate-x-1/2"></div>

        <div className="pl-8 text-green-400 text-3xl font-bold mb-2">
          500 <span className="text-sm">关注</span>
        </div>

        <Card className="ml-8 p-4 rounded-lg shadow-sm">
          <div className="space-y-3">
            <p className="text-lg font-medium">发表内容30次</p>
            <p className="text-gray-700">通过「公众号助手」发表10次</p>
            <p className="text-gray-700">距首次发表407天</p>
            <p className="text-gray-400 text-sm">2025/2/27 曝光激励+500</p>
          </div>
        </Card>
      </div>

      {/* Milestone 100 */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="absolute left-0 top-6 w-2 h-2 rounded-full bg-green-400 -translate-x-1/2"></div>

        <div className="pl-8 text-green-400 text-3xl font-bold mb-2">
          100 <span className="text-sm">关注</span>
        </div>

        <Card className="ml-8 p-4 rounded-lg shadow-sm">
          <div className="space-y-3">
            <p className="text-lg font-medium">获得新关注</p>
            <div className="flex items-center gap-3">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="用户头像"
                width={40}
                height={40}
                className="rounded-md"
              />
              <p className="text-gray-700">羽恒 是第100位关注你的用户</p>
            </div>
            <p className="text-gray-400 text-sm">2024/3/17</p>
          </div>
        </Card>
      </div>

      {/* Third Post */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="absolute left-0 top-6 w-2 h-2 rounded-full bg-blue-500 -translate-x-1/2"></div>

        <Card className="ml-8 p-4 rounded-lg shadow-sm">
          <div className="space-y-3">
            <p className="text-lg font-medium">第三次发表内容</p>
            <div className="flex justify-between items-center">
              <p className="text-gray-800">Midway - 一个面向未来的云端一体 Node.js 框架</p>
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt="Midway"
                width={80}
                height={80}
                className="rounded-md ml-4"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

