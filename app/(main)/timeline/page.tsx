import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export default function TimelinePage() {
  const stages = [
    {
      title: "Discovery",
      status: "completed",
      date: "2024-01-15",
      description: "Initial project requirements and planning"
    },
    {
      title: "Design",
      status: "completed",
      date: "2024-02-01",
      description: "UI/UX design and wireframing"
    },
    {
      title: "Development",
      status: "in-progress",
      date: "2024-03-01",
      description: "Core feature implementation"
    },
    {
      title: "Testing",
      status: "pending",
      date: "2024-04-15",
      description: "Quality assurance and bug fixing"
    },
    {
      title: "Deployment",
      status: "pending",
      date: "2024-05-01",
      description: "Production release and launch"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <div key={stage.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {getStatusIcon(stage.status)}
                  {index < stages.length - 1 && (
                    <div className="w-0.5 h-full bg-muted my-2" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{stage.title}</h3>
                    <Badge variant={stage.status === "completed" ? "default" : "outline"}>
                      {stage.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{stage.date}</p>
                  <p className="text-sm mt-1">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 