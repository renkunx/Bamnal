"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  initialImage?: string
  onImageChange: (imageUrl: string) => void
  size?: "sm" | "md" | "lg" | "xl"
}

export function AvatarUpload({ initialImage, onImageChange, size = "lg" }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40",
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "请选择小于5MB的图片",
        variant: "destructive",
      })
      return
    }

    // 创建本地预览
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setPreview(result)
      onImageChange(result) // 在实际应用中，这里应该是上传后的URL
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getInitials = () => {
    return "用户"
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-4 border-background shadow-md`}>
          <AvatarImage src={preview || ""} alt="用户头像" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">{getInitials()}</AvatarFallback>
        </Avatar>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          id="avatar-upload"
        />

        <div className="absolute -bottom-2 -right-2 flex gap-1">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">上传头像</span>
          </Button>

          {preview && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-8 w-8 rounded-full shadow"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">移除头像</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

