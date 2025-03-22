import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const getSupabaseServer = () => {
  try {
    const cookieStore = cookies()
    return createServerComponentClient({ cookies: () => cookieStore })
  } catch (error) {
    console.error("Failed to create Supabase server client:", error)

    // 在开发环境中，返回一个模拟客户端
    if (process.env.NODE_ENV === "development") {
      return createMockSupabaseServerClient()
    }

    throw error
  }
}

// 创建一个模拟的Supabase服务端客户端
function createMockSupabaseServerClient() {
  console.warn("Using mock Supabase server client. Authentication and database features will not work.")

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  } as any
}

