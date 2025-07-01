// lib/lucide-icons.ts
import * as Icons from 'lucide-react';

export const lucideIcons = Object.entries(Icons).map(([name, Icon]) => ({
  name,
  Icon: Icon as React.FC<React.SVGProps<SVGSVGElement>>,
}));
