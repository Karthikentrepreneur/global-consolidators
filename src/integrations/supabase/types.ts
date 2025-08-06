export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          is_published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      breaking_news: {
        Row: {
          content: string
          created_at: string | null
          date: string
          id: number
          image: string | null
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          date: string
          id?: number
          image?: string | null
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string
          id?: number
          image?: string | null
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          alt_text: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_visible: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_visible?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_visible?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          alt_image_title: string | null
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          date: string
          id: number
          image: string | null
          slug: string
          summary: string | null
          title: string
          updated_at: string | null
          youtube_id: string | null
        }
        Insert: {
          alt_image_title?: string | null
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          date: string
          id?: number
          image?: string | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string | null
          youtube_id?: string | null
        }
        Update: {
          alt_image_title?: string | null
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          date?: string
          id?: number
          image?: string | null
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
          youtube_id?: string | null
        }
        Relationships: []
      }
      news_archive: {
        Row: {
          archived_at: string | null
          category: string
          description: string | null
          id: number
          image_url: string | null
          published_at: string
          source: string
          title: string
          url: string
        }
        Insert: {
          archived_at?: string | null
          category: string
          description?: string | null
          id?: number
          image_url?: string | null
          published_at: string
          source: string
          title: string
          url: string
        }
        Update: {
          archived_at?: string | null
          category?: string
          description?: string | null
          id?: number
          image_url?: string | null
          published_at?: string
          source?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      news_authors: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          discount: string | null
          id: number
          image: string
          link: string
          platform: string
          price: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          discount?: string | null
          id?: number
          image: string
          link: string
          platform: string
          price: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          discount?: string | null
          id?: number
          image?: string
          link?: string
          platform?: string
          price?: number
          title?: string
        }
        Relationships: []
      }
      sitemap_entries: {
        Row: {
          change_frequency: string | null
          id: number
          last_modified: string | null
          priority: number | null
          url: string
        }
        Insert: {
          change_frequency?: string | null
          id?: number
          last_modified?: string | null
          priority?: number | null
          url: string
        }
        Update: {
          change_frequency?: string | null
          id?: number
          last_modified?: string | null
          priority?: number | null
          url?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          alt_image_title: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          title: string
          youtube_id: string
        }
        Insert: {
          alt_image_title?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          title: string
          youtube_id: string
        }
        Update: {
          alt_image_title?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          title?: string
          youtube_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
