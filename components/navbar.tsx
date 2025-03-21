import Link from "next/link"
import { Home, Tag, PlusCircle, BarChart2 } from "lucide-react"

export function Navbar() {
  return (
    <nav className="bg-green-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          竹节记
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="flex items-center">
            <Home className="mr-1" size={20} /> 主页
          </Link>
          <Link href="/tags" className="flex items-center">
            <Tag className="mr-1" size={20} /> 标签
          </Link>
          <Link href="/record/new" className="flex items-center">
            <PlusCircle className="mr-1" size={20} /> 新记录
          </Link>
          <Link href="/stats" className="flex items-center">
            <BarChart2 className="mr-1" size={20} /> 统计
          </Link>
        </div>
      </div>
    </nav>
  )
}

