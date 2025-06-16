"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { createBrowserClient } from "@/utils/supabase/client";

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

interface ProjectType {
  id: string;
  name: string;
  description: string | null;
}

interface ProjectTypeComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function ProjectTypeCombobox({
  value,
  onValueChange,
  className,
}: ProjectTypeComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [projectTypes, setProjectTypes] = React.useState<ProjectType[]>([]);

  React.useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from("project_types")
          .select("id, name, description")
          .order("name");

        if (error) throw error;
        setProjectTypes(data || []);
      } catch (error) {
        console.error("Error fetching project types:", error);
      }
    };

    fetchProjectTypes();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? projectTypes.find((type) => type.id === value)?.name
            : "Select project type..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-(--radix-popover-trigger-width)">
        <Command>
          <CommandInput placeholder="Search project type..." className="h-9" />
          <CommandList>
            <CommandEmpty>No project type found.</CommandEmpty>
            <CommandGroup>
              {projectTypes.map((type) => (
                <CommandItem
                  key={type.id}
                  value={type.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {type.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === type.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
