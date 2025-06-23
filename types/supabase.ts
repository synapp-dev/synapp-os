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
      project_type_route_role_permissions: {
        Row: {
          can_access: boolean | null
          can_view: boolean | null
          id: string
          project_type_route_id: string
          role_id: string
        }
        Insert: {
          can_access?: boolean | null
          can_view?: boolean | null
          id?: string
          project_type_route_id: string
          role_id: string
        }
        Update: {
          can_access?: boolean | null
          can_view?: boolean | null
          id?: string
          project_type_route_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_type_route_role_permissions_project_type_route_id_fkey"
            columns: ["project_type_route_id"]
            isOneToOne: false
            referencedRelation: "project_type_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_type_route_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_type_routes: {
        Row: {
          id: string
          project_type_id: string
          route_id: string
        }
        Insert: {
          id?: string
          project_type_id: string
          route_id: string
        }
        Update: {
          id?: string
          project_type_id?: string
          route_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_type_routes_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "project_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_type_routes_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      project_types: {
        Row: {
          description: string | null
          id: string
          lucide_icon: string | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          lucide_icon?: string | null
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          lucide_icon?: string | null
          name?: string
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
          project_type_id: string | null
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
          project_type_id?: string | null
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
          project_type_id?: string | null
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
          {
            foreignKeyName: "projects_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "project_types"
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
          description: string | null
          id: string
          lucide_icon: string | null
          method: string | null
          nav_group_id: string | null
          nav_label: string | null
          nav_order: number | null
          parent_id: string | null
          path: string
          rollout_at: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          lucide_icon?: string | null
          method?: string | null
          nav_group_id?: string | null
          nav_label?: string | null
          nav_order?: number | null
          parent_id?: string | null
          path: string
          rollout_at?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          lucide_icon?: string | null
          method?: string | null
          nav_group_id?: string | null
          nav_label?: string | null
          nav_order?: number | null
          parent_id?: string | null
          path?: string
          rollout_at?: string | null
        }
        Relationships: [
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
        ]
      }
      sc_carriers: {
        Row: {
          base_url: string
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          base_url: string
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          base_url?: string
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      sc_cdr_imports: {
        Row: {
          carrier_id: string
          ended_at: string
          error: string | null
          id: string
          record_count: number | null
          started_at: string
          status: string | null
          trigger_type: string
          triggered_by: string | null
        }
        Insert: {
          carrier_id: string
          ended_at: string
          error?: string | null
          id?: string
          record_count?: number | null
          started_at: string
          status?: string | null
          trigger_type?: string
          triggered_by?: string | null
        }
        Update: {
          carrier_id?: string
          ended_at?: string
          error?: string | null
          id?: string
          record_count?: number | null
          started_at?: string
          status?: string | null
          trigger_type?: string
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sc_cdr_imports_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "sc_carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sc_cdr_imports_triggered_by_fkey"
            columns: ["triggered_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sc_consolidated_cdrs: {
        Row: {
          billable: number | null
          billed_duration: number | null
          call_direction: string
          call_id: string
          call_state: string
          carrier_id: string
          cost: number
          destination_number: string
          divert_reason: string | null
          duration_seconds: number
          hash: string
          id: string
          import_id: string | null
          org_id: string | null
          rate_plan: string | null
          raw_cdr_id: string | null
          site_id: string | null
          source_number: string
          start_time: string
        }
        Insert: {
          billable?: number | null
          billed_duration?: number | null
          call_direction: string
          call_id: string
          call_state: string
          carrier_id: string
          cost: number
          destination_number: string
          divert_reason?: string | null
          duration_seconds: number
          hash: string
          id?: string
          import_id?: string | null
          org_id?: string | null
          rate_plan?: string | null
          raw_cdr_id?: string | null
          site_id?: string | null
          source_number: string
          start_time: string
        }
        Update: {
          billable?: number | null
          billed_duration?: number | null
          call_direction?: string
          call_id?: string
          call_state?: string
          carrier_id?: string
          cost?: number
          destination_number?: string
          divert_reason?: string | null
          duration_seconds?: number
          hash?: string
          id?: string
          import_id?: string | null
          org_id?: string | null
          rate_plan?: string | null
          raw_cdr_id?: string | null
          site_id?: string | null
          source_number?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "sc_consolidated_cdrs_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "sc_carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sc_consolidated_cdrs_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "sc_cdr_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sc_consolidated_cdrs_raw_cdr_id_fkey"
            columns: ["raw_cdr_id"]
            isOneToOne: false
            referencedRelation: "sc_raw_cdr_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      sc_raw_cdr_logs: {
        Row: {
          carrier_id: string
          fetched_at: string
          id: string
          metadata: Json | null
          payload: Json
        }
        Insert: {
          carrier_id: string
          fetched_at?: string
          id?: string
          metadata?: Json | null
          payload: Json
        }
        Update: {
          carrier_id?: string
          fetched_at?: string
          id?: string
          metadata?: Json | null
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "sc_raw_cdr_logs_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "sc_carriers"
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
          last_org_id: string | null
          last_project_id: string | null
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
          last_org_id?: string | null
          last_project_id?: string | null
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
          last_org_id?: string | null
          last_project_id?: string | null
          linkedin_url?: string | null
          location?: string | null
          mobile_number?: string | null
          position_title?: string | null
          profile_picture_url?: string | null
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_last_org_id_fkey"
            columns: ["last_org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_last_project_id_fkey"
            columns: ["last_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      check_project_name: {
        Args: { p_name: string; p_org_id: string }
        Returns: boolean
      }
      check_user_can_access_route: {
        Args: {
          org_slug: string
          project_slug?: string
          parent_route?: string
          sub_route?: string
        }
        Returns: boolean
      }
      get_all_project_types: {
        Args: Record<PropertyKey, never>
        Returns: {
          description: string | null
          id: string
          lucide_icon: string | null
          name: string
        }[]
      }
      get_all_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          description: string | null
          id: string
          name: string
          scope_id: string
        }[]
      }
      get_all_routes__admin: {
        Args: { org_slug: string; project_slug: string }
        Returns: {
          id: string
          path: string
          parent_id: string
          method: string
          description: string
          nav_label: string
          nav_order: number
          lucide_icon: string
          rollout_at: string
          nav_group_label: string
          nav_group_order: number
        }[]
      }
      get_organisation_id_by_slug: {
        Args: { slug: string }
        Returns: string
      }
      get_project_id_by_slug: {
        Args: { slug: string }
        Returns: string
      }
      get_project_type_route_role_permissions_by_role_id: {
        Args: { arg_role_id: string; arg_project_type_id: string }
        Returns: {
          route_id: string
        }[]
      }
      get_route_id_by_path: {
        Args: { route_path: string; parent?: string }
        Returns: string
      }
      get_routes_by_project_type_id: {
        Args: { arg_project_type_id?: string }
        Returns: {
          route_id: string
        }[]
      }
      get_user_last_view_or_default_redirect: {
        Args: { uid?: string }
        Returns: {
          org_slug: string
          project_slug: string
        }[]
      }
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
      get_user_organisation_access: {
        Args: { org_id: string; uid?: string }
        Returns: boolean
      }
      get_user_permissions: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          biography_description: string | null
          biography_title: string | null
          birthday: string | null
          business_number: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          last_org_id: string | null
          last_project_id: string | null
          linkedin_url: string | null
          location: string | null
          mobile_number: string | null
          position_title: string | null
          profile_picture_url: string | null
          settings: Json | null
        }[]
      }
      get_user_project_access: {
        Args: { project_id: string; uid?: string }
        Returns: boolean
      }
      get_user_project_nav_items: {
        Args: { active_project_id: string }
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
          can_view: boolean
          can_access: boolean
        }[]
      }
      get_user_project_role_id: {
        Args: { project_id: string; uid?: string }
        Returns: string
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
      ingest_netsip_cdrs: {
        Args: { payload: string; trigger_type?: string; triggered_by?: string }
        Returns: Json
      }
      is_authorised: {
        Args: { role_names: string[]; org_id: string; user_id?: string }
        Returns: boolean
      }
      update_last_visited_context_by_slug: {
        Args: { org_slug: string; project_slug?: string; uid?: string }
        Returns: undefined
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
