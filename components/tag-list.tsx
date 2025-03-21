"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

export function TagList() {
  const { tags, records, deleteTag } = useStore()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getRecordCount = (tagId: string) => {
    return records.filter((record) => record.tagId === tagId).length
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteTag(deleteId)
      toast({
        title: "标签已删除",
        description: "标签及其关联记录已被删除",
      })
      setDeleteId(null)
    }
  }

  return (
    <>
      {tags.length > 0 ? (
        <ul className="space-y-3">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Badge className={`${tag.color} text-white mr-3`}>{tag.name}</Badge>
                <span className="text-sm text-gray-500">{getRecordCount(tag.id)}条记录</span>
              </div>
              <div className="flex space-x-1">
                <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Link href={`/tags/${tag.id}`}>
                    <Pencil size={16} />
                    <span className="sr-only">编辑</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setDeleteId(tag.id)}
                >
                  <Trash2 size={16} />
                  <span className="sr-only">删除</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">暂无标签，请创建新标签</p>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>删除此标签将同时删除与之关联的所有记录。此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

