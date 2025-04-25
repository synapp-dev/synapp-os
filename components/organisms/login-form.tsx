"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmailInput } from "@/components/molecules/email-input";
import { PasswordInput } from "@/components/molecules/password-input";
import { SocialLoginGroup } from "@/components/molecules/social-login-group";
import { AuthDivider } from "@/components/atoms/auth-divider";
import { AuthFooter } from "@/components/molecules/auth-footer";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-sm">
                  Login to your Synapp account
                </p>
              </div>
              {error && (
                <div className="text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              <EmailInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <AuthDivider />
              <SocialLoginGroup />
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="relative bg-black hidden md:flex overflow-hidden items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-3/5 object-cover"
            >
              <source
                src="https://qcpaanr39l6dixw3.public.blob.vercel-storage.com/auth-background-p0YIIr0nFGzm7B1XMIDUgOT1SA7WGv.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </CardContent>
      </Card>
      <AuthFooter />
    </div>
  );
}
