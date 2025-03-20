import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

const tags = [
  { id: 1, name: "小明", color: "blue" },
  { id: 2, name: "小红", color: "pink" },
  { id: 3, name: "日常开销", color: "green" },
]

export function TagList() {
  return (
    <ul className="space-y-2">
      {tags.map((tag) => (
        <li key={tag.id} className="flex justify-between items-center border-b pb-2">
          <Badge className={`bg-${tag.color}-500`}>{tag.name}</Badge>
          <div>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/tags/${tag.id}/edit`}>
                <Pencil size={16} />
              </Link>
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 size={16} />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

