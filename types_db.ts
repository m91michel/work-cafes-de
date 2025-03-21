export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          filtered_reviews: Json | null
          food_content: string | null
          food_contents: Json | null
          google_place_id: string | null
          google_rating: number | null
          google_reviews: Json | null
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
          filtered_reviews?: Json | null
          food_content?: string | null
          food_contents?: Json | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews?: Json | null
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
          filtered_reviews?: Json | null
          food_content?: string | null
          food_contents?: Json | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews?: Json | null
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
        Args: {
          query: string
        }
        Returns: {
          startup_cost_before: Json
          startup_cost_after: Json
          total_cost_before: Json
          total_cost_after: Json
          index_statements: string[]
          errors: string[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
