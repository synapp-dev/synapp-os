"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContentNoPortal,
  PopoverTrigger,
} from "@/components/ui/popover"

export const projectTypes = [
  {
    value: "web-app",
    label: "Web Application",
  },
  {
    value: "mobile-app",
    label: "Mobile Application",
  },
  {
    value: "saas",
    label: "SaaS Platform",
  },
  {
    value: "ecommerce",
    label: "E-commerce",
  },
  {
    value: "api",
    label: "API Development",
  },
  {
    value: "cms",
    label: "Content Management System",
  },
  {
    value: "marketplace",
    label: "Marketplace Platform",
  },
  {
    value: "dashboard",
    label: "Analytics Dashboard",
  },
  {
    value: "other",
    label: "Other",
  },
]

interface ProjectTypeComboboxProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function ProjectTypeCombobox({
  value,
  onValueChange,
  className,
}: ProjectTypeComboboxProps) {
  const [open, setOpen] = React.useState(false)

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
            ? projectTypes.find((type) => type.value === value)?.label
            : "Select project type..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContentNoPortal className="p-0 w-(--radix-popover-trigger-width)">
        <Command>
          <CommandInput placeholder="Search project type..." className="h-9"/>
          <CommandList>
            <CommandEmpty>No project type found.</CommandEmpty>
            <CommandGroup>
              {projectTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {type.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === type.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContentNoPortal>
    </Popover>
  )
} 