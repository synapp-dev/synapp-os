"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRoles } from "@/stores/roles";

export function ProjectTypeRouteRolePermissionsCombobox() {
  const [open, setOpen] = React.useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get the current value from URL params
  const currentValue = searchParams.get("role") || "";
  const projectTypeId = searchParams.get("project-type");

  // Use the roles store
  const { roles, isLoading, error, fetchRoles, isDataStale } = useRoles();

  React.useEffect(() => {
    // Fetch roles if data is stale or empty
    if (isDataStale() || roles.length === 0) {
      fetchRoles();
    }
  }, [fetchRoles, isDataStale, roles.length]);

  const updateUrl = (newValue: string) => {
    const params = new URLSearchParams(searchParams);

    if (newValue) {
      params.set("role", newValue);
    } else {
      params.delete("role");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
                disabled={!projectTypeId}
              >
                {currentValue
                  ? roles.find((role) => role.id === currentValue)?.name
                  : "Select role..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search role..." className="h-9" />
                <CommandList>
                  <CommandEmpty>
                    {isLoading
                      ? "Loading..."
                      : error
                      ? "Error loading roles"
                      : "No role found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {roles?.map((role) => (
                      <CommandItem
                        key={role.id}
                        value={role.id}
                        onSelect={(selectedValue) => {
                          const newValue =
                            selectedValue === currentValue ? "" : selectedValue;
                          updateUrl(newValue);
                          setOpen(false);
                        }}
                      >
                        {role.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            currentValue === role.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </TooltipTrigger>
      {!projectTypeId && (
        <TooltipContent side="top" align="center">
          You must choose a project type first!
        </TooltipContent>
      )}
    </Tooltip>
  );
}
