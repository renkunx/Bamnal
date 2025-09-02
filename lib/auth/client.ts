"use client"

import { getSupabaseClient } from "../supabase/client"
import { getAppwriteClients } from "../appwrite/client"

type AuthAdapter = {
  getSession: () => Promise<any>
  onAuthStateChange: (callback: (event: any, session: any) => void) => { unsubscribe: () => void }
  signInWithPassword: (args: { email: string; password: string }) => Promise<{ error: any }>
  signUp: (args: { email: string; password: string; options?: { emailRedirectTo?: string } }) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateUser: (args: { password?: string }) => Promise<{ error: any }>
  getUser: () => Promise<{ data: { user: any } }>
}

function createSupabaseAuth(): AuthAdapter {
  const supabase = getSupabaseClient()

  return {
    getSession: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      return session
    },
    onAuthStateChange: (callback) => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => callback(event, session))
      return {
        unsubscribe: () => subscription?.unsubscribe(),
      }
    },
    signInWithPassword: async ({ email, password }) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    },
    signUp: async ({ email, password, options }) => {
      const { error } = await supabase.auth.signUp({ email, password, options })
      return { error }
    },
    signOut: async () => {
      await supabase.auth.signOut()
    },
    updateUser: async ({ password }) => {
      const { error } = await supabase.auth.updateUser({ password })
      return { error }
    },
    getUser: async () => {
      const { data } = await supabase.auth.getUser()
      return { data }
    },
  }
}

function createAppwriteAuth(): AuthAdapter {
  const { account, client } = getAppwriteClients()

  let lastUser: any | null = null
  let isUnauthorized = false
  const fetchUser = async () => {
    try {
      const user = await account.get()
      lastUser = user
      isUnauthorized = false
      return user
    } catch (err: any) {
      const status = err?.code || err?.response?.status
      if (status === 401) {
        isUnauthorized = true
      }
      lastUser = null
      return null
    }
  }

  return {
    getSession: async () => {
      const user = await fetchUser()
      return user ? { user } : null
    },
    onAuthStateChange: (callback) => {
      // 优先使用 Appwrite Realtime 监听当前账号事件，避免轮询
      const maybeSubscribe = (client as any)?.subscribe
      if (typeof maybeSubscribe === 'function') {
        try {
          const unsub = (client as any).subscribe('account', async (_event: any) => {
            const before = lastUser?.$id
            const user = await fetchUser()
            const after = user?.$id
            if (before !== after) {
              callback('USER_CHANGED', user ? { user } : null)
            }
          })
          return { unsubscribe: () => { try { unsub() } catch {} } }
        } catch {
          // 继续降级为轮询
        }
      }

      // 降级方案：仅在页面可见时轮询，并使用指数退避减少失败时请求频率；401 时进入长间隔冷却
      let active = true
      let baseDelayMs = 3000
      let currentDelay = baseDelayMs
      let timer: any
      let visibilityHandler: any

      const tick = async () => {
        if (!active) return
        try {
          if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
            // 页面不可见时跳过请求
            schedule()
            return
          }
          const before = lastUser?.$id
          const user = await fetchUser()
          const after = user?.$id
          if (before !== after) {
            callback('USER_CHANGED', user ? { user } : null)
          }
          // 成功后重置退避
          currentDelay = baseDelayMs
        } catch {
          // 失败则扩大间隔，最大 60s
          currentDelay = Math.min(currentDelay * 2, 60000)
        } finally {
          // 若处于未授权状态（401），进入长间隔冷却，并等待可见性变化时尝试更快恢复
          if (isUnauthorized) {
            currentDelay = 60000
            if (typeof document !== 'undefined' && !visibilityHandler) {
              visibilityHandler = () => {
                if (document.visibilityState === 'visible') {
                  // 恢复初始间隔并立刻重试
                  currentDelay = baseDelayMs
                  isUnauthorized = false
                  if (timer) clearTimeout(timer)
                  schedule(0)
                }
              }
              document.addEventListener('visibilitychange', visibilityHandler)
            }
          }
          schedule()
        }
      }

      const schedule = (override?: number) => {
        if (!active) return
        timer = setTimeout(tick, typeof override === 'number' ? override : currentDelay)
      }

      schedule()

      return {
        unsubscribe: () => {
          active = false
          if (timer) clearTimeout(timer)
          if (visibilityHandler && typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', visibilityHandler)
          }
        },
      }
    },
    signInWithPassword: async ({ email, password }) => {
      try {
        await account.createEmailPasswordSession(email, password)
        return { error: null }
      } catch (error) {
        return { error }
      }
    },
    signUp: async ({ email, password }) => {
      try {
        // 随机生成一个用户 ID，或可改为使用 Appwrite ID.unique()
        const { ID } = await import("appwrite")
        await account.create(ID.unique(), email, password)
        return { error: null }
      } catch (error) {
        return { error }
      }
    },
    signOut: async () => {
      try {
        await account.deleteSessions()
      } catch {}
    },
    updateUser: async ({ password }) => {
      try {
        if (!password) return { error: null }
        // 注意：Appwrite 更新密码通常需要 oldPassword，新建会话策略可能不同
        await account.updatePassword(password)
        return { error: null }
      } catch (error) {
        return { error }
      }
    },
    getUser: async () => {
      const user = await fetchUser()
      return { data: { user } }
    },
  }
}

export function getAuthAdapter(): AuthAdapter {
  const backend = process.env.NEXT_PUBLIC_BACKEND || 'supabase'
  // 缓存适配器，避免组件多次渲染时重复创建导致重复订阅
  const globalAny = globalThis as any
  globalAny.__auth_adapter_cache__ = globalAny.__auth_adapter_cache__ || {}
  const cache = globalAny.__auth_adapter_cache__

  if (backend === 'appwrite') {
    if (!cache.appwrite) cache.appwrite = createAppwriteAuth()
    return cache.appwrite as AuthAdapter
  }
  if (!cache.supabase) cache.supabase = createSupabaseAuth()
  return cache.supabase as AuthAdapter
}


