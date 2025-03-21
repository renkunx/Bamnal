"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Bell, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"

interface Reminder {
  id: string
  title: string
  tagId: string
  frequency: "daily" | "weekly" | "monthly"
  time: string
  enabled: boolean
}

export default function RemindersPage() {
  const router = useRouter()
  const { tags } = useStore()
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "记录孩子身高",
      tagId: "1",
      frequency: "monthly",
      time: "09:00",
      enabled: true,
    },
    {
      id: "2",
      title: "记录日常开销",
      tagId: "3",
      frequency: "daily",
      time: "20:00",
      enabled: true,
    },
  ])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newReminder, setNewReminder] = useState<Omit<Reminder, "id">>({
    title: "",
    tagId: "",
    frequency: "daily",
    time: "09:00",
    enabled: true,
  })

  const handleAddReminder = () => {
    if (!newReminder.title) {
      toast({
        title: "请输入提醒标题",
        variant: "destructive",
      })
      return
    }

    if (!newReminder.tagId) {
      toast({
        title: "请选择标签",
        variant: "destructive",
      })
      return
    }

    const reminder: Reminder = {
      ...newReminder,
      id: Date.now().toString(),
    }

    setReminders([...reminders, reminder])
    setShowAddDialog(false)
    setNewReminder({
      title: "",
      tagId: "",
      frequency: "daily",
      time: "09:00",
      enabled: true,
    })

    toast({
      title: "提醒已创建",
      description: "您的提醒已成功保存",
    })
  }

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((reminder) => (reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder)),
    )
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
    toast({
      title: "提醒已删除",
    })
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "每天"
      case "weekly":
        return "每周"
      case "monthly":
        return "每月"
      default:
        return frequency
    }
  }

  const getTagName = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId)
    return tag ? tag.name : "未知标签"
  }

  const getTagColor = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId)
    return tag ? tag.color : "bg-gray-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="p-0">
          <ArrowLeft className="mr-2" /> 返回
        </Button>
        <h1 className="text-2xl font-bold">提醒设置</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              添加提醒
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新提醒</DialogTitle>
              <DialogDescription>设置一个新的记录提醒</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">提醒标题</Label>
                <Input
                  id="title"
                  placeholder="输入提醒标题"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tag">关联标签</Label>
                <Select
                  value={newReminder.tagId}
                  onValueChange={(value) => setNewReminder({ ...newReminder, tagId: value })}
                >
                  <SelectTrigger id="tag">
                    <SelectValue placeholder="选择标签" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">提醒频率</Label>
                <Select
                  value={newReminder.frequency}
                  onValueChange={(value: "daily" | "weekly" | "monthly") =>
                    setNewReminder({ ...newReminder, frequency: value })
                  }
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="选择频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">每天</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">提醒时间</Label>
                <Input
                  id="time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                取消
              </Button>
              <Button onClick={handleAddReminder}>创建提醒</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>我的提醒</CardTitle>
        </CardHeader>
        <CardContent>
          {reminders.length > 0 ? (
            <ul className="space-y-3">
              {reminders.map((reminder) => (
                <li
                  key={reminder.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${getTagColor(reminder.tagId)} flex items-center justify-center mr-3`}
                    >
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{reminder.title}</p>
                      <p className="text-sm text-gray-500">
                        {getFrequencyText(reminder.frequency)} {reminder.time} | {getTagName(reminder.tagId)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={reminder.enabled} onCheckedChange={() => toggleReminder(reminder.id)} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteReminder(reminder.id)}
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Bell className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">暂无提醒</h3>
              <p className="text-gray-500 mb-4">创建提醒以便定期记录重要事项</p>
              <Button onClick={() => setShowAddDialog(true)}>创建第一个提醒</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

