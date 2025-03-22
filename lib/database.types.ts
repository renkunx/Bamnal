export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          slogan: string | null
          created_at: string
          updated_at: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          icon: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
      }
      records: {
        Row: {
          id: string
          user_id: string
          tag_id: string
          title: string
          type: "text" | "image" | "expense" | "measurement"
          content: string | null
          image_url: string | null
          amount: number | null
          category: string | null
          measurement_type: string | null
          measurement_value: number | null
          measurement_unit: string | null
          created_at: string
          updated_at: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          tag_id: string
          title: string
          frequency: "daily" | "weekly" | "monthly"
          time: string
          enabled: boolean
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

