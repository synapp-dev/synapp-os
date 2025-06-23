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
import { createBrowserClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import type { ProjectType } from "@/types/database";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function ProjectTypeRouteCombobox() {
  const [open, setOpen] = useState(false);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get the current value from URL params
  const currentValue = searchParams.get("project-type") || "";

  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchProjectTypes() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase.rpc(
          "get_all_project_types"
        );

        if (fetchError) {
          setError(fetchError.message);
        } else {
          console.log("Project types:", data);

          setProjectTypes(data || []);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch project types"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProjectTypes();
  }, [supabase]);

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
              {loading
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
