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
      nav_groups: {
        Row: {
          id: string
          is_visible: boolean | null
          label: string
          lucide_icon: string | null
          name: string
          nav_order: number | null
        }
        Insert: {
          id?: string
          is_visible?: boolean | null
          label: string
          lucide_icon?: string | null
          name: string
          nav_order?: number | null
        }
        Update: {
          id?: string
          is_visible?: boolean | null
          label?: string
          lucide_icon?: string | null
          name?: string
          nav_order?: number | null
        }
        Relationships: []
      }
      organisations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          metadata: Json | null
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          description: string | null
          id: string
        }
        Insert: {
          action: string
          description?: string | null
          id?: string
        }
        Update: {
          action?: string
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          organisation_id: string
          slug: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          organisation_id: string
          slug?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          organisation_id?: string
          slug?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: string
          name: string
          scope_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          scope_id: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          scope_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_scope_id_fkey"
            columns: ["scope_id"]
            isOneToOne: false
            referencedRelation: "scopes"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          access_permission_id: string | null
          description: string | null
          id: string
          lucide_icon: string | null
          method: string | null
          nav_group: string | null
          nav_group_id: string | null
          nav_label: string | null
          nav_order: number | null
          parent_id: string | null
          path: string
          rollout_at: string | null
          view_permission_id: string | null
        }
        Insert: {
          access_permission_id?: string | null
          description?: string | null
          id?: string
          lucide_icon?: string | null
          method?: string | null
          nav_group?: string | null
          nav_group_id?: string | null
          nav_label?: string | null
          nav_order?: number | null
          parent_id?: string | null
          path: string
          rollout_at?: string | null
          view_permission_id?: string | null
        }
        Update: {
          access_permission_id?: string | null
          description?: string | null
          id?: string
          lucide_icon?: string | null
          method?: string | null
          nav_group?: string | null
          nav_group_id?: string | null
          nav_label?: string | null
          nav_order?: number | null
          parent_id?: string | null
          path?: string
          rollout_at?: string | null
          view_permission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_access_permission_id_fkey"
            columns: ["access_permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_nav_group_id_fkey"
            columns: ["nav_group_id"]
            isOneToOne: false
            referencedRelation: "nav_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_view_permission_id_fkey"
            columns: ["view_permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      scopes: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          biography_description: string | null
          biography_title: string | null
          birthday: string | null
          business_number: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          location: string | null
          mobile_number: string | null
          position_title: string | null
          profile_picture_url: string | null
          settings: Json | null
        }
        Insert: {
          biography_description?: string | null
          biography_title?: string | null
          birthday?: string | null
          business_number?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          mobile_number?: string | null
          position_title?: string | null
          profile_picture_url?: string | null
          settings?: Json | null
        }
        Update: {
          biography_description?: string | null
          biography_title?: string | null
          birthday?: string | null
          business_number?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          mobile_number?: string | null
          position_title?: string | null
          profile_picture_url?: string | null
          settings?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          id: string
          organisation_id: string | null
          project_id: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          organisation_id?: string | null
          project_id?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          organisation_id?: string | null
          project_id?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_nav_routes: {
        Args: { project_id: string }
        Returns: {
          id: string
          path: string
          nav_label: string
          nav_group_id: string
          nav_group_name: string
          nav_group_label: string
          nav_group_order: number
          nav_order: number
          lucide_icon: string
          parent_id: string
        }[]
      }
      get_user_org_scope: {
        Args: Record<PropertyKey, never>
        Returns: {
          organisation_id: string
          organisation_name: string
          organisation_slug: string
          organisation_logo: string
          organisation_metadata: Json
          user_role_id: string
          role_id: string
          role_name: string
        }[]
      }
      get_user_permissions: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_project_scope: {
        Args: { org_id: string }
        Returns: {
          project_id: string
          project_name: string
          project_description: string
          project_slug: string
          role_id: string
          role_name: string
          permissions: Json
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
    Enums: {},
  },
} as const
