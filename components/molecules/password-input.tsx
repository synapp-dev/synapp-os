import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInput({ value, onChange }: PasswordInputProps) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center">
        <Label htmlFor="password">Password</Label>
        <a
          href="#"
          className="ml-auto text-sm underline-offset-2 hover:underline"
        >
          Forgot your password?
        </a>
      </div>
      <Input
        id="password"
        type="password"
        required
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
