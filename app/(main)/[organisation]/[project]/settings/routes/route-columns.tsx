"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  
  {
    accessorKey: "path",
    header: "Path",
  },
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "lucide_icon",
    header: "Lucide Icon",
  },
  {
    accessorKey: "parent_route",
    header: "Parent Route",
  },
  {
    accessorKey: "is_active",
    header: "Parent Route",
  },
  {
    accessorKey: "nav_order",
    header: "Nav Order",
  },
];
