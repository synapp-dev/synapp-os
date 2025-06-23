import type { Database } from './supabase'

// Utility type exports for commonly used types
export type Route = Database["public"]["Functions"]["get_all_routes__admin"]["Returns"][0];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type Organisation = Database["public"]["Tables"]["organisations"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type NavGroup = Database["public"]["Tables"]["nav_groups"]["Row"];
export type Role = Database["public"]["Tables"]["roles"]["Row"];
export type Permission = Database["public"]["Tables"]["permissions"]["Row"];
export type ProjectType = Database["public"]["Tables"]["project_types"]["Row"];

// Function return types
export type UserNavRoute = Database["public"]["Functions"]["get_user_nav_routes"]["Returns"][0];
export type UserProjectNavItem = Database["public"]["Functions"]["get_user_project_nav_items"]["Returns"][0];
export type UserOrgScope = Database["public"]["Functions"]["get_user_org_scope"]["Returns"][0];
export type UserProjectScope = Database["public"]["Functions"]["get_user_project_scope"]["Returns"][0];
export type UserLastView = Database["public"]["Functions"]["get_user_last_view_or_default_redirect"]["Returns"][0]; 