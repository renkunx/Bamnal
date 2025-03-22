"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// 创建客户端单例，避免多次实例化
let supabaseClient: ReturnType<typeof createClientComponentClient> | null = null

export const getSupabaseClient = () => {
  // 检查环境变量是否存在
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Please check your environment variables.")

    // 返回一个模拟的客户端，避免应用崩溃
    // 在开发环境中，这将允许应用继续运行，但Supabase功能将不可用
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      return createMockSupabaseClient()
    }
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClientComponentClient()
    } catch (error) {
      console.error("Failed to create Supabase client:", error)

      // 在开发环境中返回模拟客户端
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        return createMockSupabaseClient()
      }

      throw error
    }
  }

  return supabaseClient
}

// 创建一个模拟的Supabase客户端，用于开发环境
function createMockSupabaseClient() {
  console.warn("Using mock Supabase client. Authentication and database features will not work.")

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error("Mock Supabase client") }),
      signUp: () => Promise.resolve({ data: null, error: new Error("Mock Supabase client") }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: () => Promise.resolve({ data: null, error: new Error("Mock Supabase client") }),
      updateUser: () => Promise.resolve({ data: null, error: new Error("Mock Supabase client") }),
    },
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  } as any
}

