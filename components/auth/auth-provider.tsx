"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { getAuthAdapter } from "@/lib/auth/client"

type AuthContextType = {
  user: any | null
  session: any | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const auth = getAuthAdapter()
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true)
      try {
        const session = await auth.getSession()
        setSession(session)
        setUser(session?.user ?? session ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const subscription = auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? session ?? null)
      setIsLoading(false)
      
      // 根据认证状态进行路由跳转
      if (session) {
        router.push('/')
      } else {
        router.push('/auth/login')
      }
    })

    return () => {
      subscription?.unsubscribe?.()
    }
  }, [auth, router])

  const signIn = async (email: string, password: string) => {
    const { error } = await auth.signInWithPassword({ email, password })
    if (!error) {
      router.push('/')
    }
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
    if (!error) {
      router.push('/auth/verify-email')
    }
    return { error }
  }

  const signOut = async () => {
    await auth.signOut()
    router.push('/auth/login')
  }

  const resetPassword = async (email: string) => {
    const backend = process.env.NEXT_PUBLIC_BACKEND || 'supabase'
    if (backend === 'supabase') {
      const { getSupabaseClient } = await import("@/lib/supabase/client")
      const supabase = getSupabaseClient()
      return await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset-password` })
    }
    return { error: { message: '请在 Appwrite 控制台配置密码重置流程' } }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

