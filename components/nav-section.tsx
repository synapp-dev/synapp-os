"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavSection({
  title,
  items,
}: {
  title: string;
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
      icon?: LucideIcon
    }[]
  }[]
}) {
  const pathname = usePathname()
  const [openItem, setOpenItem] = React.useState<string | null>(null)

  // Update the open item when pathname changes
  React.useEffect(() => {
    const activeItem = items.find(item => 
      pathname === item.url || 
      (item.items?.some(subItem => pathname === `${item.url}${subItem.url}`) ?? false)
    )
    setOpenItem(activeItem?.title ?? null)
  }, [pathname, items])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url || 
            (item.items?.some(subItem => pathname === `${item.url}${subItem.url}`) ?? false)
          const isOpen = openItem === item.title
          
          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={(open) => {
                if (open) {
                  setOpenItem(item.title)
                } else if (isOpen) {
                  setOpenItem(null)
                }
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {item.items && item.items.length > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items && item.items.length > 0 && (
                  <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={pathname === `${item.url}${subItem.url}`}>
                            <Link href={`${item.url}${subItem.url}`}>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
    )
}
