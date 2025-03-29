import { getSupabaseClient } from "./client"

const supabase = getSupabaseClient()

export async function uploadImage(image: string, folder: string = "images", bucket: string = "images") {
  try {
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
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export async function deleteImage(path: string, bucket: string = "images") {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

export async function getImageUrl(path: string, bucket: string = "images"): Promise<string> {
  const { data } = await supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  return data?.publicUrl || ''
}

export async function getSignedUrl(path: string, bucket: string = "images"): Promise<string> {
  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60)
  return data?.signedUrl || ''
}
