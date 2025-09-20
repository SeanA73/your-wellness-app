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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      biometric_data: {
        Row: {
          additional_data: Json | null
          created_at: string | null
          data_type: string
          id: string
          recorded_at: string
          source: string | null
          unit: string
          user_id: string | null
          value: number
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string | null
          data_type: string
          id?: string
          recorded_at: string
          source?: string | null
          unit: string
          user_id?: string | null
          value: number
        }
        Update: {
          additional_data?: Json | null
          created_at?: string | null
          data_type?: string
          id?: string
          recorded_at?: string
          source?: string | null
          unit?: string
          user_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "biometric_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_interactions: {
        Row: {
          ai_message: string
          context: Json | null
          created_at: string | null
          id: string
          interaction_type: string | null
          sentiment_score: number | null
          user_id: string | null
          user_response: string | null
        }
        Insert: {
          ai_message: string
          context?: Json | null
          created_at?: string | null
          id?: string
          interaction_type?: string | null
          sentiment_score?: number | null
          user_id?: string | null
          user_response?: string | null
        }
        Update: {
          ai_message?: string
          context?: Json | null
          created_at?: string | null
          id?: string
          interaction_type?: string | null
          sentiment_score?: number | null
          user_id?: string | null
          user_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaching_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_database: {
        Row: {
          barcode: string | null
          brand: string | null
          calories_per_serving: number | null
          categories: string[] | null
          created_at: string | null
          id: string
          macros: Json | null
          micronutrients: Json | null
          name: string
          serving_size: string | null
          verified: boolean | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          calories_per_serving?: number | null
          categories?: string[] | null
          created_at?: string | null
          id?: string
          macros?: Json | null
          micronutrients?: Json | null
          name: string
          serving_size?: string | null
          verified?: boolean | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          calories_per_serving?: number | null
          categories?: string[] | null
          created_at?: string | null
          id?: string
          macros?: Json | null
          micronutrients?: Json | null
          name?: string
          serving_size?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      meals: {
        Row: {
          consumed_at: string
          created_at: string | null
          description: string | null
          food_items: Json
          id: string
          image_url: string | null
          macros: Json | null
          meal_type: string | null
          total_calories: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          consumed_at: string
          created_at?: string | null
          description?: string | null
          food_items: Json
          id?: string
          image_url?: string | null
          macros?: Json | null
          meal_type?: string | null
          total_calories?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          consumed_at?: string
          created_at?: string | null
          description?: string | null
          food_items?: Json
          id?: string
          image_url?: string | null
          macros?: Json | null
          meal_type?: string | null
          total_calories?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          fitness_goals: string[] | null
          full_name: string | null
          gender: string | null
          health_conditions: string[] | null
          height_cm: number | null
          id: string
          updated_at: string | null
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          fitness_goals?: string[] | null
          full_name?: string | null
          gender?: string | null
          health_conditions?: string[] | null
          height_cm?: number | null
          id: string
          updated_at?: string | null
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          fitness_goals?: string[] | null
          full_name?: string | null
          gender?: string | null
          health_conditions?: string[] | null
          height_cm?: number | null
          id?: string
          updated_at?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_value: number | null
          goal_type: string
          id: string
          status: string | null
          target_date: string | null
          target_value: number | null
          unit: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_type: string
          id?: string
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          unit?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_type?: string
          id?: string
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          unit?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          coach_communication_style: string | null
          created_at: string | null
          id: string
          meal_reminders: boolean | null
          metric_units: boolean | null
          notification_settings: Json | null
          preferred_workout_times: string[] | null
          privacy_settings: Json | null
          updated_at: string | null
          user_id: string | null
          workout_reminders: boolean | null
        }
        Insert: {
          coach_communication_style?: string | null
          created_at?: string | null
          id?: string
          meal_reminders?: boolean | null
          metric_units?: boolean | null
          notification_settings?: Json | null
          preferred_workout_times?: string[] | null
          privacy_settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
          workout_reminders?: boolean | null
        }
        Update: {
          coach_communication_style?: string | null
          created_at?: string | null
          id?: string
          meal_reminders?: boolean | null
          metric_units?: boolean | null
          notification_settings?: Json | null
          preferred_workout_times?: string[] | null
          privacy_settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
          workout_reminders?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wellness_checkins: {
        Row: {
          activities: Json | null
          checked_in_at: string
          created_at: string | null
          energy_level: number | null
          id: string
          mood_rating: number | null
          notes: string | null
          sleep_quality: number | null
          stress_level: number | null
          user_id: string | null
        }
        Insert: {
          activities?: Json | null
          checked_in_at: string
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id?: string | null
        }
        Update: {
          activities?: Json | null
          checked_in_at?: string
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wellness_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          exercises: Json
          id: string
          is_active: boolean | null
          is_template: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
          workout_type: string[] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          exercises: Json
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
          workout_type?: string[] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          exercises?: Json
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
          workout_type?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          calories_burned: number | null
          completed: boolean | null
          created_at: string | null
          end_time: string | null
          exercises_completed: Json | null
          heart_rate_data: Json | null
          id: string
          notes: string | null
          perceived_exertion: number | null
          start_time: string
          user_id: string | null
          workout_plan_id: string | null
        }
        Insert: {
          calories_burned?: number | null
          completed?: boolean | null
          created_at?: string | null
          end_time?: string | null
          exercises_completed?: Json | null
          heart_rate_data?: Json | null
          id?: string
          notes?: string | null
          perceived_exertion?: number | null
          start_time: string
          user_id?: string | null
          workout_plan_id?: string | null
        }
        Update: {
          calories_burned?: number | null
          completed?: boolean | null
          created_at?: string | null
          end_time?: string | null
          exercises_completed?: Json | null
          heart_rate_data?: Json | null
          id?: string
          notes?: string | null
          perceived_exertion?: number | null
          start_time?: string
          user_id?: string | null
          workout_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
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
