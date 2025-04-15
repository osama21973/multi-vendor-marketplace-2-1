export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      commissions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string
          payout_date: string | null
          status: Database["public"]["Enums"]["commission_status"] | null
          store_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id: string
          payout_date?: string | null
          status?: Database["public"]["Enums"]["commission_status"] | null
          store_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          payout_date?: string | null
          status?: Database["public"]["Enums"]["commission_status"] | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content_ar: string
          content_en: string
          created_at: string | null
          id: string
          is_read: boolean | null
          user_id: string
        }
        Insert: {
          content_ar: string
          content_en: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          user_id: string
        }
        Update: {
          content_ar?: string
          content_en?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          currency: string
          customer_id: string
          id: string
          status: Database["public"]["Enums"]["order_status"] | null
          store_id: string
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          currency: string
          customer_id: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          store_id: string
          total_amount: number
        }
        Update: {
          created_at?: string | null
          currency?: string
          customer_id?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          store_id?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_codes: {
        Row: {
          code: string
          created_at: string | null
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string | null
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string | null
          used?: boolean
        }
        Relationships: []
      }
      price_history: {
        Row: {
          changed_at: string | null
          new_price: number | null
          old_price: number | null
          product_id: string | null
        }
        Insert: {
          changed_at?: string | null
          new_price?: number | null
          old_price?: number | null
          product_id?: string | null
        }
        Update: {
          changed_at?: string | null
          new_price?: number | null
          old_price?: number | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          id: string
          inventory: number | null
          name_ar: string
          name_en: string
          price: number
          published: boolean | null
          rating: number | null
          store_id: string
          updated_at: string | null
          variants: Json | null
        }
        Insert: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          inventory?: number | null
          name_ar: string
          name_en: string
          price: number
          published?: boolean | null
          rating?: number | null
          store_id: string
          updated_at?: string | null
          variants?: Json | null
        }
        Update: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          inventory?: number | null
          name_ar?: string
          name_en?: string
          price?: number
          published?: boolean | null
          rating?: number | null
          store_id?: string
          updated_at?: string | null
          variants?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id: string
          rating?: number | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      store_categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_template: boolean | null
          name_ar: string
          name_en: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_template?: boolean | null
          name_ar: string
          name_en: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_template?: boolean | null
          name_ar?: string
          name_en?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          category_id: number | null
          commission_rate: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name_ar: string
          name_en: string
          owner_id: string
        }
        Insert: {
          category_id?: number | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name_ar: string
          name_en: string
          owner_id: string
        }
        Update: {
          category_id?: number | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name_ar?: string
          name_en?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "store_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          approved: boolean | null
          created_at: string | null
          currency: string | null
          email: string
          id: string
          owner_code: string | null
          preferred_language: string | null
          role: Database["public"]["Enums"]["user_role"]
          stripe_account_id: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          currency?: string | null
          email: string
          id?: string
          owner_code?: string | null
          preferred_language?: string | null
          role: Database["public"]["Enums"]["user_role"]
          stripe_account_id?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          currency?: string | null
          email?: string
          id?: string
          owner_code?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          stripe_account_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_owner_code_fkey"
            columns: ["owner_code"]
            isOneToOne: false
            referencedRelation: "owner_codes"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_commission: {
        Args: { order_id: string }
        Returns: number
      }
    }
    Enums: {
      commission_status: "pending" | "paid" | "hold"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      user_role: "owner" | "vendor" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      commission_status: ["pending", "paid", "hold"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      user_role: ["owner", "vendor", "customer"],
    },
  },
} as const
