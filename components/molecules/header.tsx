import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/atoms/theme-toggle";
import { RightSidebarTrigger } from "@/components/ui/right-sidebar-trigger";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  // Remove empty segments and format the path segments
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href: `/${pathname
        .split("/")
        .slice(0, pathname.split("/").indexOf(segment) + 1)
        .join("/")}`,
    }));

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 justify-between transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 sticky top-0 z-50 bg-background">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {pathSegments.map((segment, index) => (
              <BreadcrumbItem key={segment.href} className="hidden md:block">
                {index < pathSegments.length - 1 ? (
                  <BreadcrumbLink href={segment.href}>
                    {segment.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                )}
                {index < pathSegments.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2 px-4">
        <ThemeToggle />
        <RightSidebarTrigger />
      </div>
    </header>
  );
}
