import { getSupabaseClient } from "./client"
import { getAppwriteClients } from "../appwrite/client"
import { ID } from "appwrite"

const supabase = getSupabaseClient()

export async function uploadImage(image: string, folder: string = "images", bucket: string = "images") {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND || 'supabase'

    if (backend === 'appwrite') {
      const { storage } = getAppwriteClients()

      if (!process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID) {
        throw new Error('Missing Appwrite env: NEXT_PUBLIC_APPWRITE_BUCKET_ID')
      }

      let fileBlob: Blob
      let fileExt: string

      if (image.startsWith('data:image/')) {
        const base64 = image.split('base64,')[1]
        fileExt = image.split(';')[0].split('/')[1]
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        fileBlob = new Blob([bytes], { type: `image/${fileExt}` })
      } else {
        throw new Error('Invalid image format')
      }

      const fileId = ID.unique()
      await storage.createFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, fileId, fileBlob)

      return { path: fileId }
    } else {
      let fileBuffer: Buffer
      let fileExt: string

      if (image.startsWith('data:image/')) {
        // 处理 base64 图片
        const base64 = image.split('base64,')[1]
        fileExt = image.split(';')[0].split('/')[1]
        fileBuffer = Buffer.from(base64, 'base64')
      } else {
        throw new Error('Invalid image format')
      }

      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
          contentType: `image/${fileExt}`
        })

      if (uploadError) {
        throw uploadError
      }

      return {
        path: filePath,
      }
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export async function deleteImage(path: string, bucket: string = "images") {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND || 'supabase'

    if (backend === 'appwrite') {
      const { storage } = getAppwriteClients()
      if (!process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID) {
        throw new Error('Missing Appwrite env: NEXT_PUBLIC_APPWRITE_BUCKET_ID')
      }
      await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, path)
    } else {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        throw error
      }
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

export async function getImageUrl(path: string, bucket: string = "images"): Promise<string> {
  const backend = process.env.NEXT_PUBLIC_BACKEND || 'supabase'

  if (backend === 'appwrite') {
    const { storage } = getAppwriteClients()
    if (!process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID) {
      throw new Error('Missing Appwrite env: NEXT_PUBLIC_APPWRITE_BUCKET_ID')
    }
    // 预览/直链（前提：桶为公开或使用规则允许访问）
    const url = storage.getFilePreview(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, path, 0, 0, 'center')
    // SDK 返回 URL 实例或字符串，统一转字符串
    return typeof url === 'string' ? url : (url as URL).toString()
  }

  const { data } = await supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  return data?.publicUrl || ''
}

export async function getSignedUrl(path: string, bucket: string = "images"): Promise<string> {
  const backend = process.env.NEXT_PUBLIC_BACKEND || 'supabase'

  if (backend === 'appwrite') {
    // Appwrite 无直接等价的短期签名 URL（Web 端常用 getFileView/Preview）
    // 若桶非公开，需要通过 Appwrite Functions 或使用 JWT（Appwrite 1.6+）实现。
    // 这里退化为预览链接。
    return getImageUrl(path)
  }

  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60)
  return data?.signedUrl || ''
}
