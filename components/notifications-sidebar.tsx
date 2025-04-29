"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
} from "lucide-react";

import { RightSidebar } from "@/components/ui/right-sidebar";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// This is sample data.
const data = {
  user: {
    name: "Aaron Girton",
    email: "aaron@synapp.com.au",
    avatar: "",
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
      title: "All",
      icon: Bell,
      isActive: true,
      count: 12,
    },
    {
      title: "Unread",
      icon: AlertCircle,
      isActive: false,
      count: 3,
    },
    {
      title: "Comments",
      icon: MessageSquare,
      isActive: false,
      count: 5,
    },
    {
      title: "Pending",
      icon: Clock,
      isActive: false,
      count: 2,
    },
    {
      title: "Completed",
      icon: CheckCircle2,
      isActive: false,
      count: 7,
    },
    {
      title: "Settings",
      icon: Settings2,
      isActive: false,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
  notifications: [
    {
      id: 1,
      type: "comment",
      title: "John Doe commented on your post",
      message:
        "This is really interesting! I've been working on something similar. Would love to hear more about your approach.",
      time: "2 minutes ago",
      read: false,
      avatar: "/avatars/01.png",
    },
    {
      id: 2,
      type: "like",
      title: "Sarah Smith liked your photo",
      message:
        "Your latest project update looks amazing! The new design is really coming together.",
      time: "1 hour ago",
      read: false,
      avatar: "/avatars/02.png",
    },
    {
      id: 3,
      type: "mention",
      title: "You were mentioned in a post",
      message:
        "Check out this new feature @you implemented. It's exactly what we needed!",
      time: "3 hours ago",
      read: true,
      avatar: "/avatars/03.png",
    },
    {
      id: 4,
      type: "follow",
      title: "New follower",
      message: "Michael Brown started following you",
      time: "5 hours ago",
      read: true,
      avatar: "/avatars/04.png",
    },
    {
      id: 5,
      type: "system",
      title: "System update completed",
      message:
        "Your workspace has been updated to the latest version with new features and improvements.",
      time: "1 day ago",
      read: true,
      avatar: "/avatars/05.png",
    },
  ],
};

export function NotificationsSidebar() {
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filteredNotifications = React.useMemo(() => {
    let filtered = data.notifications;
    if (filter !== "all") {
      filtered = filtered.filter((n) => n.type === filter);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchLower) ||
          n.message.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  }, [filter, search]);

  return (
    <RightSidebar collapsible="icon">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-4" />
            <span className="text-base font-medium">Notifications</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[50px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="like">Likes</SelectItem>
              <SelectItem value="mention">Mentions</SelectItem>
              <SelectItem value="follow">Follows</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <SidebarInput
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-3 transition-colors hover:bg-accent ${
                !notification.read ? "bg-accent/50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-full bg-muted">
                  {/* Avatar would go here */}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="line-clamp-1 text-sm font-medium">
                      {notification.title}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-4 text-xs text-muted-foreground">
          <span>{filteredNotifications.length} notifications</span>
          <button className="hover:text-foreground">Mark all as read</button>
        </div>
      </SidebarFooter>
    </RightSidebar>
  );
}
