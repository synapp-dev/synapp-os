import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CountrySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CountrySelect({ value, onValueChange }: CountrySelectProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor="country">Country</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="country">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="US">United States</SelectItem>
          <SelectItem value="CA">Canada</SelectItem>
          <SelectItem value="GB">United Kingdom</SelectItem>
          <SelectItem value="AU">Australia</SelectItem>
          <SelectItem value="DE">Germany</SelectItem>
          <SelectItem value="FR">France</SelectItem>
          <SelectItem value="JP">Japan</SelectItem>
          <SelectItem value="IN">India</SelectItem>
          <SelectItem value="BR">Brazil</SelectItem>
          <SelectItem value="ZA">South Africa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
