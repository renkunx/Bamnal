"use client"

import { create } from "zustand"
import { getSupabaseClient } from "@/lib/supabase/client"

export type RecordType = "text" | "image" | "expense" | "measurement"

export interface Tag {
  id: string
  name: string
  color: string
  icon?: string
  category?: string
  createdAt: string
}

export interface Record {
  id: string
  title: string
  tagId: string
  type: RecordType
  content?: string
  imageUrl?: string
  amount?: number
  category?: string
  measurementType?: string
  measurementValue?: number
  measurementUnit?: string
  createdAt: string
}

export interface Reminder {
  id: string
  title: string
  tagId: string
  frequency: "daily" | "weekly" | "monthly"
  time: string
  enabled: boolean
  createdAt: string
}

interface BambooStore {
  tags: Tag[]
  records: Record[]
  reminders: Reminder[]
  isLoading: boolean
  error: string | null

  // 标签操作
  fetchTags: () => Promise<void>
  addTag: (tag: Omit<Tag, "id" | "createdAt">) => Promise<Tag | null>
  updateTag: (id: string, tag: Partial<Omit<Tag, "id" | "createdAt">>) => Promise<void>
  deleteTag: (id: string) => Promise<void>

  // 记录操作
  fetchRecords: () => Promise<void>
  addRecord: (record: Omit<Record, "id" | "createdAt">) => Promise<Record | null>
  updateRecord: (id: string, record: Partial<Omit<Record, "id" | "createdAt">>) => Promise<void>
  deleteRecord: (id: string) => Promise<void>

  // 提醒操作
  fetchReminders: () => Promise<void>
  addReminder: (reminder: Omit<Reminder, "id" | "createdAt">) => Promise<Reminder | null>
  updateReminder: (id: string, reminder: Partial<Omit<Reminder, "id" | "createdAt">>) => Promise<void>
  deleteReminder: (id: string) => Promise<void>
}

export const useStore = create<BambooStore>((set, get) => ({
  tags: [],
  records: [],
  reminders: [],
  isLoading: false,
  error: null,

  // 标签操作
  fetchTags: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not available")

      const { data, error } = await supabase.from("tags").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({
        tags:
          data?.map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
            icon: tag.icon || undefined,
            category: tag.category || undefined,
            createdAt: tag.created_at,
          })) || [],
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching tags:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addTag: async (tag) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) throw new Error("用户未登录")

      const { data, error } = await supabase
        .from("tags")
        .insert([
          {
            user_id: userData.user.id,
            name: tag.name,
            color: tag.color,
            icon: tag.icon,
            category: tag.category,
          },
        ])
        .select()
        .single()

      if (error) throw error

      const newTag = {
        id: data.id,
        name: data.name,
        color: data.color,
        icon: data.icon || undefined,
        category: data.category || undefined,
        createdAt: data.created_at,
      }

      set((state) => ({ tags: [newTag, ...state.tags], isLoading: false }))
      return newTag
    } catch (error) {
      console.error("Error adding tag:", error)
      set({ error: (error as Error).message, isLoading: false })
      return null
    }
  },

  updateTag: async (id, tag) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("tags")
        .update({
          name: tag.name,
          color: tag.color,
          icon: tag.icon,
          category: tag.category,
        })
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? { ...t, ...tag } : t)),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating tag:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  deleteTag: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("tags").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        tags: state.tags.filter((t) => t.id !== id),
        records: state.records.filter((r) => r.tagId !== id),
        reminders: state.reminders.filter((r) => r.tagId !== id),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error deleting tag:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  // 记录操作
  fetchRecords: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("records").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({
        records:
          data?.map((record) => ({
            id: record.id,
            title: record.title,
            tagId: record.tag_id,
            type: record.type as RecordType,
            content: record.content || undefined,
            imageUrl: record.image_url || undefined,
            amount: record.amount || undefined,
            category: record.category || undefined,
            measurementType: record.measurement_type || undefined,
            measurementValue: record.measurement_value || undefined,
            measurementUnit: record.measurement_unit || undefined,
            createdAt: record.created_at,
          })) || [],
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching records:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addRecord: async (record) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) throw new Error("用户未登录")

      const { data, error } = await supabase
        .from("records")
        .insert([
          {
            user_id: userData.user.id,
            tag_id: record.tagId,
            title: record.title,
            type: record.type,
            content: record.content,
            image_url: record.imageUrl,
            amount: record.amount,
            category: record.category,
            measurement_type: record.measurementType,
            measurement_value: record.measurementValue,
            measurement_unit: record.measurementUnit,
          },
        ])
        .select()
        .single()

      if (error) throw error

      const newRecord = {
        id: data.id,
        title: data.title,
        tagId: data.tag_id,
        type: data.type as RecordType,
        content: data.content || undefined,
        imageUrl: data.image_url || undefined,
        amount: data.amount || undefined,
        category: data.category || undefined,
        measurementType: data.measurement_type || undefined,
        measurementValue: data.measurement_value || undefined,
        measurementUnit: data.measurement_unit || undefined,
        createdAt: data.created_at,
      }

      set((state) => ({ records: [newRecord, ...state.records], isLoading: false }))
      return newRecord
    } catch (error) {
      console.error("Error adding record:", error)
      set({ error: (error as Error).message, isLoading: false })
      return null
    }
  },

  updateRecord: async (id, record) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()

      const { error } = await supabase
        .from("records")
        .update({
          tag_id: record.tagId,
          title: record.title,
          type: record.type,
          content: record.content,
          image_url: record.imageUrl,
          amount: record.amount,
          category: record.category,
          measurement_type: record.measurementType,
          measurement_value: record.measurementValue,
          measurement_unit: record.measurementUnit,
        })
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        records: state.records.map((r) => (r.id === id ? { ...r, ...record } : r)),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating record:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  deleteRecord: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("records").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        records: state.records.filter((r) => r.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error deleting record:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  // 提醒操作
  fetchReminders: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("reminders").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({
        reminders:
          data?.map((reminder) => ({
            id: reminder.id,
            title: reminder.title,
            tagId: reminder.tag_id,
            frequency: reminder.frequency as "daily" | "weekly" | "monthly",
            time: reminder.time,
            enabled: reminder.enabled,
            createdAt: reminder.created_at,
          })) || [],
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching reminders:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addReminder: async (reminder) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) throw new Error("用户未登录")

      const { data, error } = await supabase
        .from("reminders")
        .insert([
          {
            user_id: userData.user.id,
            tag_id: reminder.tagId,
            title: reminder.title,
            frequency: reminder.frequency,
            time: reminder.time,
            enabled: reminder.enabled,
          },
        ])
        .select()
        .single()

      if (error) throw error

      const newReminder = {
        id: data.id,
        title: data.title,
        tagId: data.tag_id,
        frequency: data.frequency as "daily" | "weekly" | "monthly",
        time: data.time,
        enabled: data.enabled,
        createdAt: data.created_at,
      }

      set((state) => ({ reminders: [newReminder, ...state.reminders], isLoading: false }))
      return newReminder
    } catch (error) {
      console.error("Error adding reminder:", error)
      set({ error: (error as Error).message, isLoading: false })
      return null
    }
  },

  updateReminder: async (id, reminder) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("reminders")
        .update({
          tag_id: reminder.tagId,
          title: reminder.title,
          frequency: reminder.frequency,
          time: reminder.time,
          enabled: reminder.enabled,
        })
        .eq("id", id)

      if (error) throw error

      set((state) => ({
        reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...reminder } : r)),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating reminder:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  deleteReminder: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("reminders").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error deleting reminder:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },
}))

