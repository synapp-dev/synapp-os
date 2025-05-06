"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { NotificationsSidebar } from "@/components/notifications-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RightSidebarProvider } from "@/components/ui/right-sidebar-provider";
import { Header } from "@/components/molecules/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <SidebarInset>
            <div className="px-6 py-3">{children}</div>
          </SidebarInset>
        </div>
        <NotificationsSidebar />
      </RightSidebarProvider>
    </SidebarProvider>
  );
}
