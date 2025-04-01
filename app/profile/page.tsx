"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TagList } from "@/components/tag-list"
import Link from "next/link"
import { Settings, Bell, Download, Moon, HelpCircle, LogOut, BarChart2, Edit } from "lucide-react"
import { useStore } from "@/lib/store"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { useProfileStore } from "@/lib/profile-service"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from "@/lib/supabase/client"
export default function ProfilePage() {
  const { records, tags } = useStore()
  const { user } = useAuth()
  const router = useRouter()
  const { profile, fetchProfile } = useProfileStore()
  const [darkMode, setDarkMode] = useState(false)
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showRemindersDialog, setShowRemindersDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showThemeDialog, setShowThemeDialog] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user, fetchProfile])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
    toast({
      title: !darkMode ? "已切换到深色模式" : "已切换到浅色模式",
    })
  }

  const toggleReminders = () => {
    setRemindersEnabled(!remindersEnabled)
    toast({
      title: !remindersEnabled ? "提醒已开启" : "提醒已关闭",
    })
  }

  const handleExport = () => {
    const data = {
      tags,
      records,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `竹节记数据导出_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setShowExportDialog(false)
    toast({
      title: "数据导出成功",
      description: "您的数据已成功导出为JSON文件",
    })
  }

  // 获取用户名首字母或默认值
  const getInitials = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase()
    }
    return "用户"
  }

  const logout = () => {
    supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-green-500 to-emerald-600"></div>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center -mt-12 mb-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={profile?.avatarUrl || "/placeholder.svg?height=96&width=96&text=ZS"} alt="用户头像" />
              <AvatarFallback className="bg-primary text-white text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mt-2">{profile?.username || "未设置用户名"}</h2>
            <p className="text-gray-500">{profile?.slogan || "记录生活的点滴"}</p>

            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/profile/edit" className="flex items-center">
                <Edit className="mr-2 h-4 w-4" /> 编辑个人信息
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-b">
            <div>
              <p className="text-2xl font-bold">{records.length}</p>
              <p className="text-sm text-gray-500">记录</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{tags.length}</p>
              <p className="text-sm text-gray-500">标签</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.floor((new Date().getTime() - new Date("2023-01-01").getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-sm text-gray-500">天数</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="card-hover">
          <CardContent
            className="p-4 flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={() => setShowSettingsDialog(true)}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium">设置</h3>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent
            className="p-4 flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={() => setShowRemindersDialog(true)}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
              <Bell className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-medium">提醒</h3>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent
            className="p-4 flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={() => setShowExportDialog(true)}
          >
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium">导出</h3>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent
            className="p-4 flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={() => setShowThemeDialog(true)}
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <Moon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium">主题</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">我的标签</CardTitle>
        </CardHeader>
        <CardContent>
          <TagList />
          <Button asChild className="w-full mt-4">
            <Link href="/tags">管理标签</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">数据统计</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/stats" className="flex items-center justify-center">
              <BarChart2 className="mr-2 h-4 w-4" /> 查看详细统计
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button variant="outline" className="w-full flex justify-start">
          <HelpCircle className="mr-2 h-4 w-4" /> 帮助与反馈
        </Button>
        <Button onClick={logout} variant="outline" className="w-full flex justify-start text-red-500 hover:text-red-600">
          <LogOut className="mr-2 h-4 w-4" /> 退出登录
        </Button>
      </div>

      {/* 设置对话框 */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>应用设置</DialogTitle>
            <DialogDescription>自定义您的竹节记应用设置</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">自动保存</h4>
                <p className="text-sm text-gray-500">编辑时自动保存记录</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">显示创建时间</h4>
                <p className="text-sm text-gray-500">在记录列表中显示创建时间</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">隐私模式</h4>
                <p className="text-sm text-gray-500">启用后需要密码才能访问应用</p>
              </div>
              <Switch />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSettingsDialog(false)}>保存设置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 提醒对话框 */}
      <Dialog open={showRemindersDialog} onOpenChange={setShowRemindersDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>提醒设置</DialogTitle>
            <DialogDescription>设置记录提醒</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">启用提醒</h4>
                <p className="text-sm text-gray-500">接收记录提醒通知</p>
              </div>
              <Switch checked={remindersEnabled} onCheckedChange={toggleReminders} />
            </div>
            <div className={!remindersEnabled ? "opacity-50 pointer-events-none" : ""}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">每日提醒</h4>
                  <p className="text-sm text-gray-500">每天提醒您记录</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">重要事件提醒</h4>
                  <p className="text-sm text-gray-500">重要事件前提醒</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowRemindersDialog(false)}>保存设置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 导出对话框 */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导出数据</DialogTitle>
            <DialogDescription>导出您的所有记录和标签数据</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">您将导出以下数据：</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>{tags.length} 个标签</li>
              <li>{records.length} 条记录</li>
              <li>所有相关设置</li>
            </ul>
            <p className="text-sm text-gray-500">数据将以JSON格式导出，可用于备份或迁移。</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              取消
            </Button>
            <Button onClick={handleExport}>导出数据</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 主题对话框 */}
      <Dialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>主题设置</DialogTitle>
            <DialogDescription>自定义应用外观</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">深色模式</h4>
                <p className="text-sm text-gray-500">切换深色/浅色主题</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
            <div>
              <h4 className="font-medium mb-2">主题颜色</h4>
              <div className="grid grid-cols-5 gap-2">
                <button className="w-8 h-8 rounded-full bg-green-500 ring-2 ring-offset-2 ring-green-500"></button>
                <button className="w-8 h-8 rounded-full bg-blue-500"></button>
                <button className="w-8 h-8 rounded-full bg-purple-500"></button>
                <button className="w-8 h-8 rounded-full bg-amber-500"></button>
                <button className="w-8 h-8 rounded-full bg-red-500"></button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowThemeDialog(false)}>保存设置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

