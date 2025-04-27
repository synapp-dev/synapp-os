"use client"

import * as React from "react"
import {
  AudioWaveform,
  BanknoteArrowUp,
  BarChart,
  Bell,
  CalendarRange,
  ChartNoAxesCombined,
  ChevronsRight,
  CircleCheckBig,
  CircleFadingArrowUp,
  Codesandbox,
  Command,
  FilePenLine,
  Files,
  FolderGit2,
  GalleryVerticalEnd,
  Info,
  LifeBuoy,
  ListChecks,
  ListTodo,
  Milestone,
  Package,
  PackageOpen,
  Phone,
  Presentation,
  Quote,
  Rss,
  Settings,
  ShieldCheck,
  Signature,
  SquareTerminal,
  Ticket,
  TicketCheck,
  Tickets,
  Users,
} from "lucide-react"

import { NavSection } from "@/components/nav-section"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ProjectSwitcher } from "./project-switcher"

// This is sample data.
const data = {
  user: {
    name: "Aaron Girton",
    email: "aaron@synapp.com.au",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
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
    },  {
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
          url: "#",
        },
        {
          title: "FAQ",
          url: "#",
        },
        {
          title: "Terms",
          url: "#",
        },
        {
          title: "Privacy",
          url: "#",
        },
      ],
    },{
      title: "About",
      url: "/about",
      icon: Info,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Instantemp",
      url: "/instantemp",
      icon: FolderGit2,
    },
    {
      name: "Bullyproof",
      url: "/bullyproof",
      icon: FolderGit2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        
      </SidebarHeader>
      <SidebarContent>
        <div className="px-4">
          <ProjectSwitcher projects={data.projects} />
        </div>
        <NavSection items={data.navMain} />
        <NavSection items={data.navGeneral} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
