"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import { create } from "zustand"

export interface Profile {
  id: string
  username: string | null
  avatarUrl: string | null
  slogan: string | null
}

interface ProfileStore {
  profile: Profile | null
  isLoading: boolean
  error: string | null

  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<Omit<Profile, "id">>) => Promise<void>
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()

      // 获取当前用户
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) {
        set({ profile: null, isLoading: false })
        return
      }

      // 获取用户资料
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        // 如果没有找到资料，可能是新用户，创建一个新的资料
        if (error.code === "PGRST116") {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: user.id }])
            .select()
            .single()

          if (insertError) throw insertError

          set({
            profile: {
              id: newProfile.id,
              username: newProfile.username,
              avatarUrl: newProfile.avatar_url,
              slogan: newProfile.slogan,
            },
            isLoading: false,
          })
          return
        }
        throw error
      }

      set({
        profile: {
          id: data.id,
          username: data.username,
          avatarUrl: data.avatar_url,
          slogan: data.slogan,
        },
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()

      // 获取当前用户
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error("用户未登录")

      // 更新用户资料
      const { error } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          avatar_url: data.avatarUrl,
          slogan: data.slogan,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      // 更新本地状态
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating profile:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },
}))

