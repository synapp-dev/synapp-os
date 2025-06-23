import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center animate-pulse">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
}
