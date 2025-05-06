"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/hooks/use-navigation";

// Helper to check if any descendant is active
function isDescendantActive(item: NavItem, pathname: string): boolean {
  if (pathname === `/${item.url}`) return true;
  return (
    item.items?.some((child: NavItem) => isDescendantActive(child, pathname)) ??
    false
  );
}

export function NavSection({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}) {
  const pathname = usePathname();

  React.useEffect(() => {
    console.log("Current pathname:", pathname);
  }, [pathname]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavItemRecursive key={item.url} item={item} pathname={pathname} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavItemRecursive({
  item,
  pathname,
  isChild = false,
}: {
  item: NavItem;
  pathname: string;
  isChild?: boolean;
}) {
  // Check if this item or any descendant is active
  const isActive = pathname === `/${item.url}`;
  const hasActiveChild = item.items?.some((child: NavItem) =>
    isDescendantActive(child, pathname)
  );
  const isOpen = isActive || hasActiveChild;
  const hasChildren = item.items && item.items.length > 0;

  return (
    <Collapsible open={isOpen} asChild className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            isActive={isActive}
            className={[
              hasActiveChild
                ? "border-l-2 border-muted-foreground font-bold transition-all"
                : "",
              !isActive && !hasActiveChild
                ? "text-foreground/75 hover:text-foreground transition-colors"
                : "",
              isActive ? "text-foreground" : "",
            ].join(" ")}
          >
            <Link href={`/${item.url}`}>
              {item.icon && (
                <item.icon
                  className={
                    isChild ? "w-3 h-3 min-w-3 min-h-3 shrink-0" : undefined
                  }
                  style={isChild ? { width: 12, height: 12 } : undefined}
                />
              )}
              <span className={isChild ? "text-xs" : undefined}>
                {item.title}
              </span>
              {hasChildren && (
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              )}
            </Link>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {hasChildren && (
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <SidebarMenuSub>
              {item.items?.map((child: NavItem) => (
                <NavItemRecursive
                  key={child.url}
                  item={child}
                  pathname={pathname}
                  isChild={true}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
