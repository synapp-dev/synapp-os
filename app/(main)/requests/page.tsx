import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RequestsPage() {
  const requests = [
    {
      id: 1,
      title: "Add new feature: User authentication",
      status: "pending",
      priority: "high",
      date: "2024-04-20",
      description: "Client requested to add user authentication system with social login options"
    },
    {
      id: 2,
      title: "Update color scheme",
      status: "in-progress",
      priority: "medium",
      date: "2024-04-18",
      description: "Client wants to update the primary color scheme to match their brand guidelines"
    },
    {
      id: 3,
      title: "Fix mobile responsiveness",
      status: "completed",
      priority: "high",
      date: "2024-04-15",
      description: "Several UI elements are not properly responsive on mobile devices"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Requests</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{request.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={request.priority === "high" ? "destructive" : "secondary"}>
                    {request.priority}
                  </Badge>
                  <Badge variant={request.status === "completed" ? "default" : "outline"}>
                    {request.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{request.description}</p>
              <p className="text-sm text-muted-foreground">Requested on: {request.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 