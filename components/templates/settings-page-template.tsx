import { StaggeredAnimation } from "@/components/atoms/staggered-animation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface SettingsPageTemplateProps {
  title?: string;
  customItems?: {
    title: string;
    content?: ReactNode;
    height?: number;
  }[];
}

const defaultCardTitles = [
  "Example Card A",
  "Example Card B",
  "Example Card C",
  "Example Card D",
  "Example Card E",
  "Example Card F",
  "Example Card G",
  "Example Card H",
  "Example Card I",
  "Example Card J",
  "Example Card K",
  "Example Card L",
  "Example Card M",
  "Example Card N",
  "Example Card O",
];

const possibleHeights = [150, 275, 325, 375, 425];
const maxPerHeight = 3;

function generateHeights(numItems: number) {
  const heights: number[] = [];
  const usage: Record<number, number> = Object.fromEntries(
    possibleHeights.map((h) => [h, 0])
  );
  let usedSet = new Set<number>();

  for (let i = 0; i < numItems; i++) {
    // Get available heights: not used 3 times and not in usedSet
    const available = possibleHeights.filter(
      (h) => usage[h] < maxPerHeight && !usedSet.has(h)
    );
    if (available.length === 0) {
      // All 5 have been used, reset the usedSet
      usedSet = new Set<number>();
      // Recompute available
      const fallback = possibleHeights.filter((h) => usage[h] < maxPerHeight);
      if (fallback.length === 0) break; // All used up
      // Pick a random fallback
      const h = fallback[Math.floor(Math.random() * fallback.length)];
      heights.push(h);
      usage[h]++;
      usedSet.add(h);
      continue;
    }
    // Pick a random available height
    const h = available[Math.floor(Math.random() * available.length)];
    heights.push(h);
    usage[h]++;
    usedSet.add(h);
  }
  return heights;
}

export function SettingsPageTemplate({
  title,
  customItems,
}: SettingsPageTemplateProps) {
  const items =
    customItems ||
    (() => {
      const heights = generateHeights(defaultCardTitles.length);
      return defaultCardTitles.map((title, i) => ({
        title,
        height: heights[i],
      }));
    })();

  return (
    <div className="">
      {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
      <div className="columns-1 sm:columns-2 2xl:columns-3 gap-4">
        {items.map((item, index) => (
          <StaggeredAnimation key={item.title} index={index}>
            <Card
              key={index}
              className="break-inside-avoid mb-4"
              style={{ height: item.height ? `${item.height}px` : undefined }}
            >
              <CardHeader>
                <CardTitle className="text-muted-foreground/75">
                  {item.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </StaggeredAnimation>
        ))}
      </div>
    </div>
  );
}
