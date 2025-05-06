import { StaggeredAnimation } from "@/components/atoms/staggered-animation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface SettingsPageTemplateProps {
  title?: string;
  columns?: number;
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
];

function getRandomHeight() {
  const heights = [150, 200, 250, 300, 350];
  return heights[Math.floor(Math.random() * heights.length)];
}

export function SettingsPageTemplate({
  title,
  columns = 3,
  customItems,
}: SettingsPageTemplateProps) {
  const items =
    customItems ||
    defaultCardTitles.map((title) => ({
      title,
      height: getRandomHeight(),
    }));

  return (
    <div className="">
      {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
      <div className={`columns-${columns} gap-4 space-y-4`}>
        {items.map((item, index) => (
          <StaggeredAnimation key={item.title} index={index}>
            <Card
              key={index}
              className="mb-4 break-inside-avoid"
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
