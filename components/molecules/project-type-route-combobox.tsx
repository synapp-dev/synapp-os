"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useProjectTypes } from "@/stores/project-types";

export function ProjectTypeRouteCombobox() {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get the current value from URL params
  const currentValue = searchParams.get("project-type") || "";

  // Use the project types store
  const { projectTypes, isLoading, error, fetchProjectTypes, isDataStale } =
    useProjectTypes();

  useEffect(() => {
    // Fetch project types if data is stale or empty
    if (isDataStale() || projectTypes.length === 0) {
      fetchProjectTypes();
    }
  }, [fetchProjectTypes, isDataStale, projectTypes.length]);

  const updateUrl = (newValue: string) => {
    const params = new URLSearchParams(searchParams);

    if (newValue) {
      params.set("project-type", newValue);
    } else {
      params.delete("project-type");
    }
    // Always remove the role param when project-type changes
    params.delete("role");

    router.push(`${pathname}?${params.toString()}`);
  };

  // Helper to get Lucide icon component by name
  function getLucideIcon(iconName: string): LucideIcon {
    return (
      (LucideIcons as unknown as Record<string, LucideIcon>)[iconName] ||
      LucideIcons.Folder
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentValue
            ? (() => {
                const selected = projectTypes.find(
                  (pt) => pt.id === currentValue
                );
                if (!selected) return "Select project type...";
                const Icon = getLucideIcon(selected.lucide_icon || "");
                return (
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {selected.name}
                  </div>
                );
              })()
            : "Select project type..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search project type..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? "Loading..."
                : error
                ? "Error loading project types"
                : "No project type found."}
            </CommandEmpty>
            <CommandGroup>
              {projectTypes?.map((projectType) => {
                const Icon = getLucideIcon(projectType.lucide_icon || "");
                return (
                  <CommandItem
                    key={projectType.id}
                    value={projectType.id || ""}
                    onSelect={(selectedValue) => {
                      const newValue =
                        selectedValue === currentValue ? "" : selectedValue;
                      updateUrl(newValue);
                      setOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {projectType.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        currentValue === projectType.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
