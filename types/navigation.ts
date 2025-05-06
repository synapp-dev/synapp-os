import { LucideIcon } from "lucide-react";

export type NavRoute = {
  id: string;
  path: string;
  nav_label: string;
  nav_group: string;
  nav_order: number;
  lucide_icon: string | null;
  parent_id: string | null;
};

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavItem[];
};

export type NavSection = {
  id: string;
  title: string;
  items: NavItem[];
}; 