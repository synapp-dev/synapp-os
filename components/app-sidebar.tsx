"use client";

import * as React from "react";
import {
  BanknoteArrowUp,
  Bell,
  Bot,
  CalendarRange,
  ChartNoAxesCombined,
  ChevronsRight,
  CircleCheckBig,
  CircleFadingArrowUp,
  Codesandbox,
  CreditCard,
  FilePenLine,
  Files,
  FileText,
  FolderGit2,
  GraduationCap,
  HelpCircle,
  Infinity,
  Info,
  LifeBuoy,
  ListChecks,
  ListTodo,
  Mail,
  Milestone,
  Package,
  PackageOpen,
  Presentation,
  Quote,
  ScanText,
  Settings,
  ShieldCheck,
  Signature,
  SquareTerminal,
  Ticket,
  TicketCheck,
  Tickets,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { NavSection } from "@/components/nav-section";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ProjectSwitcher } from "./project-switcher";
import { Separator } from "./ui/separator";

// This is sample data.
const data = {
  user: {
    name: "Aaron Girton",
    email: "aaron@synapp.com.au",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Bullyproof Australia",
      logo: GraduationCap,
      plan: "Education",
    },
    {
      name: "400 Gradi",
      logo: UtensilsCrossed,
      plan: "Restaurant",
    },
    {
      name: "Evil Corp.",
      logo: Bot,
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: CalendarRange,
      items: [
        {
          title: "Milestones",
          url: "/milestones",
          icon: Milestone,
        },
        {
          title: "Meetings",
          url: "/meetings",
          icon: Presentation,
        },
        {
          title: "Sprints",
          url: "/sprints",
          icon: ChevronsRight,
        },
      ],
    },
    {
      title: "Timeline",
      url: "/timeline",
      icon: ChartNoAxesCombined,
      items: [
        {
          title: "Progress",
          url: "/progress",
          icon: CircleFadingArrowUp,
        },
        {
          title: "Changelog",
          url: "/changelog",
          icon: FilePenLine,
        },
      ],
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CircleCheckBig,
      items: [
        {
          title: "Current",
          url: "/current",
          icon: ListTodo,
        },
        {
          title: "Completed",
          url: "/completed",
          icon: ListChecks,
        },
      ],
    },
    {
      title: "Requests",
      url: "/requests",
      icon: Tickets,
      items: [
        {
          title: "Pending",
          url: "/pending",
          icon: Ticket,
        },
        {
          title: "Completed",
          url: "/completed",
          icon: TicketCheck,
        },
      ],
    },
    {
      title: "Files",
      url: "/files",
      icon: Files,
      items: [
        {
          title: "Contracts",
          url: "/contracts",
          icon: Signature,
        },
        {
          title: "Quotes",
          url: "/quotes",
          icon: Quote,
        },
        {
          title: "Assets",
          url: "/assets",
          icon: Package,
        },
        {
          title: "Deliverables",
          url: "/deliverables",
          icon: PackageOpen,
        },
        {
          title: "Invoices",
          url: "/invoices",
          icon: BanknoteArrowUp,
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Team",
          url: "/team",
          icon: Users,
        },
        {
          title: "Brand",
          url: "/brand",
          icon: Codesandbox,
        },
        {
          title: "Notifications",
          url: "/notifications",
          icon: Bell,
        },
        {
          title: "Permissions",
          url: "/permissions",
          icon: ShieldCheck,
        },
      ],
    },
  ],
  navGeneral: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
      items: [
        {
          title: "Contact",
          url: "/contact",
          icon: Mail,
        },
        {
          title: "FAQ",
          url: "/faq",
          icon: HelpCircle,
        },
        {
          title: "Terms",
          url: "/terms",
          icon: FileText,
        },
        {
          title: "Privacy",
          url: "/privacy",
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: "About",
      url: "/about",
      icon: Info,
      items: [
        {
          title: "General",
          url: "/general",
          icon: ScanText, 
        },
        {
          title: "Billing",
          url: "/billing",
          icon: CreditCard,
        },
        {
          title: "Limits",
          url: "/limits",
          icon: Infinity,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Instantemp",
      url: "/instantemp",
      icon: FolderGit2,
      type: "Web Application",
    },
    {
      name: "Bullyproof",
      url: "/bullyproof",
      icon: FolderGit2,
      type: "Web Application",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <div className="px-2 pt-4">
          <ProjectSwitcher projects={data.projects} />
        </div>
        <NavSection title="Project Menu" items={data.navMain} />
        <NavSection title="General" items={data.navGeneral} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
