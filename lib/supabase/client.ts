"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// 创建客户端单例，避免多次实例化
let supabaseClient: ReturnType<typeof createClientComponentClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient()
  }
  return supabaseClient
}

