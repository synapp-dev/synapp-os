import { SettingsPageTemplate } from "@/components/templates/settings-page-template";
import { CdrTable } from "./cdr-table";

export default function TasksPage() {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">CDR Data</h1>
      <div className="h-full overflow-auto max-w-full">
        <CdrTable />
      </div>
    </div>
  );
}
