import Image from "next/image"
import { Card } from "@/components/ui/card"

interface Post {
  id: number
  title: string
  content: string
  date: string
  image?: string
}

const posts: Post[] = [
  {
    id: 1,
    title: "第三次发表内容",
    content: "Midway - 一个面向未来的云端一体 Node.js 框架",
    date: "2024/1/31",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    title: "第二次发表内容",
    content: "Nitro:值的推荐的web服务端框架",
    date: "2024/1/24",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    title: "首次发表内容",
    content: "Hello World",
    date: "2024/1/17",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    title: "注册",
    content: "",
    date: "2024/1/17",
  },
]

export function Timeline() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      {posts.map((post) => (
        <div key={post.id} className="relative pl-12 pr-4 py-4">
          {/* Timeline dot */}
          <div
            className={`absolute left-6 top-6 w-2 h-2 rounded-full -translate-x-1/2 ${post.id === 4 ? "bg-green-400" : "bg-blue-500"}`}
          ></div>

          <Card className="p-4 rounded-lg shadow-sm">
            {post.title && <h3 className="text-lg font-medium mb-2">{post.title}</h3>}

            <div className="flex justify-between items-center">
              <div>
                {post.content && <p className="text-gray-800 mb-2">{post.content}</p>}
                <p className="text-gray-400 text-sm">{post.date}</p>
              </div>

              {post.image && (
                <div className="ml-4">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

