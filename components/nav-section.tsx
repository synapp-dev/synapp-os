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
import { useOrganisation } from "@/stores/organisation";
import { useProject } from "@/stores/project";
import { StaggeredAnimation } from "./atoms/staggered-animation";

// Helper to check if any descendant is active
function isDescendantActive(
  item: NavItem,
  pathname: string,
  orgSlug?: string,
  projectSlug?: string
): boolean {
  const fullPath = `/${orgSlug}/${projectSlug}/${item.url}`;
  if (pathname === fullPath) return true;

  return (
    item.items?.some((child: NavItem) =>
      isDescendantActive(child, pathname, orgSlug, projectSlug)
    ) ?? false
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
  const { currentOrganisation } = useOrganisation();
  const { currentProject } = useProject();

  React.useEffect(() => {
    console.log("Current pathname:", pathname);
  }, [pathname]);

  return (
    // <StaggeredAnimation index={title.length}>
    <SidebarGroup>
      <SidebarGroupLabel className="animate-slide-left-fade-in">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <StaggeredAnimation
            key={`${item.url}-${item.title}`}
            index={index}
            incrementDelay={0.1}
            fadeDirection="up"
          >
            <NavItemRecursive
              key={`${item.url}-${item.title}`}
              item={item}
              pathname={pathname}
              orgSlug={currentOrganisation?.slug}
              projectSlug={currentProject?.slug}
            />
          </StaggeredAnimation>
        ))}
      </SidebarMenu>
    </SidebarGroup>
    // </StaggeredAnimation>
  );
}

function NavItemRecursive({
  item,
  pathname,
  isChild = false,
  orgSlug,
  projectSlug,
}: {
  item: NavItem;
  pathname: string;
  isChild?: boolean;
  orgSlug?: string;
  projectSlug?: string;
}) {
  const { currentOrganisation } = useOrganisation();
  const { currentProject } = useProject();

  // Check if this item or any descendant is active
  const isActive =
    pathname ===
    `/${currentOrganisation?.slug}/${currentProject?.slug}/${item.url}`;
  const hasActiveChild = item.items?.some((child: NavItem) =>
    isDescendantActive(child, pathname, orgSlug, projectSlug)
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
            <Link
              href={`/${currentOrganisation?.slug}/${currentProject?.slug}/${item.url}`}
            >
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
                  key={`${child.url}-${child.title}`}
                  item={child}
                  pathname={pathname}
                  isChild={true}
                  orgSlug={orgSlug}
                  projectSlug={projectSlug}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
