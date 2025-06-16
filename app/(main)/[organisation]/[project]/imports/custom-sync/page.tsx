"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { createBrowserClient } from "@/utils/supabase/client";

export default function CustomSyncPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient();

  const handleManualImport = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase.functions.invoke(
        "manual-netsip-import",
        {
          body: { name: "Functions" },
        }
      );

      console.log("data", data);

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during import"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Manual Netsip Import</CardTitle>
          <CardDescription>
            Trigger a manual import of Netsip data. This process may take
            several minutes to complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              Import process started successfully. You can check the status in
              the imports list.
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleManualImport} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Starting Import..." : "Start Manual Import"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
