export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  cafeforwork: {
    Tables: {
      cafes: {
        Row: {
          about_content: Json | null
          address: string | null
          ambiance: string | null
          checked: string | null
          city: string | null
          city_slug: string | null
          country_code: string | null
          created_at: string | null
          drinks_content: Json | null
          food_content: string | null
          food_contents: Json | null
          google_place_id: string | null
          google_rating: number | null
          id: string
          lat_long: string | null
          links: Json | null
          links_text: string | null
          maps_data: Json | null
          name: string | null
          open_hours: string | null
          preview_image: string | null
          price_level: number | null
          processed: Json | null
          processed_at: string | null
          published_at: string | null
          review_count: number
          seating_comfort: string | null
          slug: string | null
          source: string | null
          status: string
          tripadvisor_id: string | null
          updated_at: string | null
          user_ratings_total: number | null
          website_content: string | null
          website_url: string | null
          wifi_qualitity: string | null
          work_friendly_content: Json | null
        }
        Insert: {
          about_content?: Json | null
          address?: string | null
          ambiance?: string | null
          checked?: string | null
          city?: string | null
          city_slug?: string | null
          country_code?: string | null
          created_at?: string | null
          drinks_content?: Json | null
          food_content?: string | null
          food_contents?: Json | null
          google_place_id?: string | null
          google_rating?: number | null
          id?: string
          lat_long?: string | null
          links?: Json | null
          links_text?: string | null
          maps_data?: Json | null
          name?: string | null
          open_hours?: string | null
          preview_image?: string | null
          price_level?: number | null
          processed?: Json | null
          processed_at?: string | null
          published_at?: string | null
          review_count?: number
          seating_comfort?: string | null
          slug?: string | null
          source?: string | null
          status?: string
          tripadvisor_id?: string | null
          updated_at?: string | null
          user_ratings_total?: number | null
          website_content?: string | null
          website_url?: string | null
          wifi_qualitity?: string | null
          work_friendly_content?: Json | null
        }
        Update: {
          about_content?: Json | null
          address?: string | null
          ambiance?: string | null
          checked?: string | null
          city?: string | null
          city_slug?: string | null
          country_code?: string | null
          created_at?: string | null
          drinks_content?: Json | null
          food_content?: string | null
          food_contents?: Json | null
          google_place_id?: string | null
          google_rating?: number | null
          id?: string
          lat_long?: string | null
          links?: Json | null
          links_text?: string | null
          maps_data?: Json | null
          name?: string | null
          open_hours?: string | null
          preview_image?: string | null
          price_level?: number | null
          processed?: Json | null
          processed_at?: string | null
          published_at?: string | null
          review_count?: number
          seating_comfort?: string | null
          slug?: string | null
          source?: string | null
          status?: string
          tripadvisor_id?: string | null
          updated_at?: string | null
          user_ratings_total?: number | null
          website_content?: string | null
          website_url?: string | null
          wifi_qualitity?: string | null
          work_friendly_content?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cafes_city_slug_fkey"
            columns: ["city_slug"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "cafes_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      cities: {
        Row: {
          cafes_count: number | null
          country: string | null
          country_code: string | null
          created_at: string | null
          description_long_de: string | null
          description_long_en: string | null
          description_short_de: string | null
          description_short_en: string | null
          lat_long: string | null
          name_de: string | null
          name_en: string | null
          name_local: string | null
          population: number | null
          preview_image: string | null
          processed_at: string | null
          slug: string
          state: string | null
          state_code: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cafes_count?: number | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          description_long_de?: string | null
          description_long_en?: string | null
          description_short_de?: string | null
          description_short_en?: string | null
          lat_long?: string | null
          name_de?: string | null
          name_en?: string | null
          name_local?: string | null
          population?: number | null
          preview_image?: string | null
          processed_at?: string | null
          slug: string
          state?: string | null
          state_code?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cafes_count?: number | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          description_long_de?: string | null
          description_long_en?: string | null
          description_short_de?: string | null
          description_short_en?: string | null
          lat_long?: string | null
          name_de?: string | null
          name_en?: string | null
          name_local?: string | null
          population?: number | null
          preview_image?: string | null
          processed_at?: string | null
          slug?: string
          state?: string | null
          state_code?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      countries: {
        Row: {
          city_count: number
          code: string
          created_at: string
          flag: string | null
          latitude: string | null
          longitude: string | null
          name: string | null
          status: string | null
        }
        Insert: {
          city_count?: number
          code: string
          created_at?: string
          flag?: string | null
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          status?: string | null
        }
        Update: {
          city_count?: number
          code?: string
          created_at?: string
          flag?: string | null
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reddit_post_replies: {
        Row: {
          created_at: string | null
          id: string
          is_approved: boolean | null
          metadata: Json | null
          post_id: string
          published: boolean | null
          published_at: string | null
          reply_message: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          metadata?: Json | null
          post_id: string
          published?: boolean | null
          published_at?: string | null
          reply_message: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          metadata?: Json | null
          post_id?: string
          published?: boolean | null
          published_at?: string | null
          reply_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_post_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "reddit_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_posts: {
        Row: {
          author: string
          created_at: string
          created_utc: number
          eval_confidence: number | null
          eval_reasoning: string | null
          eval_shouldReply: number | null
          has_been_replied: boolean | null
          id: string
          is_relevant: boolean | null
          keywords: Json | null
          mail_send_at: string | null
          meta_data: Json
          notes: string | null
          num_comments: number
          permalink: string
          reddit_id: string
          reply_id: string | null
          search_id: string | null
          selftext: string | null
          subreddit: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          author: string
          created_at?: string
          created_utc: number
          eval_confidence?: number | null
          eval_reasoning?: string | null
          eval_shouldReply?: number | null
          has_been_replied?: boolean | null
          id?: string
          is_relevant?: boolean | null
          keywords?: Json | null
          mail_send_at?: string | null
          meta_data?: Json
          notes?: string | null
          num_comments?: number
          permalink: string
          reddit_id: string
          reply_id?: string | null
          search_id?: string | null
          selftext?: string | null
          subreddit: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          author?: string
          created_at?: string
          created_utc?: number
          eval_confidence?: number | null
          eval_reasoning?: string | null
          eval_shouldReply?: number | null
          has_been_replied?: boolean | null
          id?: string
          is_relevant?: boolean | null
          keywords?: Json | null
          mail_send_at?: string | null
          meta_data?: Json
          notes?: string | null
          num_comments?: number
          permalink?: string
          reddit_id?: string
          reply_id?: string | null
          search_id?: string | null
          selftext?: string | null
          subreddit?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_posts_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "reddit_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_searches: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_checked: string | null
          name: string | null
          query: string
          result_limit: number
          sort: string
          subreddits: string[]
          time_frame: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_checked?: string | null
          name?: string | null
          query: string
          result_limit?: number
          sort?: string
          subreddits?: string[]
          time_frame?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_checked?: string | null
          name?: string | null
          query?: string
          result_limit?: number
          sort?: string
          subreddits?: string[]
          time_frame?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_image: string | null
          author_name: string | null
          author_url: string | null
          cafe_id: string | null
          created_at: string
          id: string
          language: string | null
          published_at: string | null
          rating: number | null
          source: string | null
          source_id: string | null
          source_url: string | null
          text_de: string | null
          text_en: string | null
          text_original: string | null
          updated_at: string | null
        }
        Insert: {
          author_image?: string | null
          author_name?: string | null
          author_url?: string | null
          cafe_id?: string | null
          created_at?: string
          id?: string
          language?: string | null
          published_at?: string | null
          rating?: number | null
          source?: string | null
          source_id?: string | null
          source_url?: string | null
          text_de?: string | null
          text_en?: string | null
          text_original?: string | null
          updated_at?: string | null
        }
        Update: {
          author_image?: string | null
          author_name?: string | null
          author_url?: string | null
          cafe_id?: string | null
          created_at?: string
          id?: string
          language?: string | null
          published_at?: string | null
          rating?: number | null
          source?: string | null
          source_id?: string | null
          source_url?: string | null
          text_de?: string | null
          text_en?: string | null
          text_original?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_report: {
        Row: {
          cafe_name: string | null
          cafe_slug: string | null
          created_at: string
          email: string | null
          id: number
          issue_type: string | null
          name: string | null
          text: string | null
        }
        Insert: {
          cafe_name?: string | null
          cafe_slug?: string | null
          created_at?: string
          email?: string | null
          id?: number
          issue_type?: string | null
          name?: string | null
          text?: string | null
        }
        Update: {
          cafe_name?: string | null
          cafe_slug?: string | null
          created_at?: string
          email?: string | null
          id?: number
          issue_type?: string | null
          name?: string | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_report_cafe_slug_fkey"
            columns: ["cafe_slug"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["slug"]
          },
        ]
      }
      user_suggestions: {
        Row: {
          country: string | null
          created_at: string
          email: string | null
          form_values: Json | null
          id: string
          message: string | null
          record_type: string | null
          slug: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          email?: string | null
          form_values?: Json | null
          id?: string
          message?: string | null
          record_type?: string | null
          slug?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string | null
          form_values?: Json | null
          id?: string
          message?: string | null
          record_type?: string | null
          slug?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      index_advisor: {
        Args: { query: string }
        Returns: {
          errors: string[]
          index_statements: string[]
          startup_cost_after: Json
          startup_cost_before: Json
          total_cost_after: Json
          total_cost_before: Json
        }[]
      }
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
  cafeforwork: {
    Enums: {},
  },
} as const
