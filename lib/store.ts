"use client"

import { create } from "zustand"
import { getSupabaseClient } from "@/lib/supabase/client"
import { getSignedUrl, uploadImage } from './supabase/storage'

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
  content: string
  imageUrl?: string
  amount?: number
  unit?: string
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
  updateRecord: (id: string, record: Partial<Record>) => Promise<void>
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
      const { data, error } = await supabase.from("tags").select("*").order("created_at", { ascending: false })
      if (error) throw error

      set({
        tags: (data || []).map(tag => ({
          id: tag.id as string,
          name: tag.name as string,
          color: tag.color as string,
          icon: tag.icon as string,
          category: tag.category as string,
          createdAt: tag.created_at as string
        })),
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching tags:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addTag: async (tag: Omit<Tag, "id" | "createdAt">) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("tags")
        .insert(tag)
        .select()
        .single()

      if (error) throw error

      const newTag: Tag = {
        id: data.id as string,
        name: data.name as string,
        color: data.color as string,
        icon: data.icon as string,
        category: data.category as string,
        createdAt: data.created_at as string
      }

      set((state) => ({
        tags: [newTag, ...state.tags],
        isLoading: false,
      }))

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

      // 获取图片url
      const records = await Promise.all(data?.map(async (record) => {
        let image_url = undefined
        if (record.image_url) {
          image_url = await getSignedUrl(record.image_url as string, 'records')
        }

        return {
          id: record.id as string,
          title: record.title as string,
          tagId: record.tag_id as string,
          type: record.type as "text" | "image" | "expense" | "measurement",
          content: record.content as string,
          imageUrl: image_url,
          amount: record.amount as number,
          category: record.category as string,
          measurementType: record.measurement_type as string,
          measurementValue: record.measurement_value as number,
          measurementUnit: record.measurement_unit as string,
          createdAt: record.created_at as string
        } as Record
      }))

      set({
        records: records || [],
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching records:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addRecord: async (record: Omit<Record, "id" | "createdAt">) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("用户未登录")

      // 将文件上传storage
      let path = undefined
      if (record?.imageUrl?.includes(';base64,')) {
        const { path: newPath } = await uploadImage(record?.imageUrl || '', userData.user.id, 'records')
        path = newPath
      }

      const { data, error } = await supabase
        .from("records")
        .insert([
          {
            user_id: userData.user.id,
            tag_id: record.tagId,
            title: record.title,
            type: record.type,
            content: record.content,
            image_url: path || record.imageUrl,
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

      const newRecord: Record = {
        id: data.id as string,
        title: data.title as string,
        tagId: data.tag_id as string,
        type: data.type as "text" | "image" | "expense" | "measurement",
        content: data.content as string,
        imageUrl: data.image_url as string,
        amount: data.amount as number,
        unit: data.unit as string,
        createdAt: data.created_at as string
      }

      set((state) => ({
        records: [newRecord, ...state.records],
        isLoading: false,
      }))

      return newRecord
    } catch (error) {
      console.error("Error adding record:", error)
      set({ error: (error as Error).message, isLoading: false })
      return null
    }
  },

  updateRecord: async (id: string, record: Partial<Record>) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()
      let image_url = undefined
      if (record.imageUrl?.includes(';base64,')){
        // 将文件上传storage
        const { path } = await uploadImage(record?.imageUrl || '', userData?.user?.id, 'records')
        record.imageUrl = path
        image_url = await getSignedUrl(path, 'records')
      }

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
        records: state.records.map((r) =>
          r.id === id ? { 
            ...r, 
            ...record,
            imageUrl: image_url || r.imageUrl
          } : r
        ),
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
        reminders: (data || []).map(reminder => ({
          id: reminder.id as string,
          title: reminder.title as string,
          tagId: reminder.tag_id as string,
          frequency: reminder.frequency as "daily" | "weekly" | "monthly",
          time: reminder.time as string,
          enabled: reminder.enabled as boolean,
          createdAt: reminder.created_at as string
        })),
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching reminders:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addReminder: async (reminder: Omit<Reminder, "id" | "createdAt">) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("reminders")
        .insert(reminder)
        .select()
        .single()

      if (error) throw error

      const newReminder: Reminder = {
        id: data.id as string,
        title: data.title as string,
        tagId: data.tag_id as string,
        frequency: data.frequency as "daily" | "weekly" | "monthly",
        time: data.time as string,
        enabled: data.enabled as boolean,
        createdAt: data.created_at as string
      }

      set((state) => ({
        reminders: [newReminder, ...state.reminders],
        isLoading: false,
      }))

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

