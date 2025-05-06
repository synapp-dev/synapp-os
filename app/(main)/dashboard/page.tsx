"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Clock,
  File,
  Folder,
  GitBranch,
  GitCommit,
  Upload,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTimeline, setActiveTimeline] = useState("ux");

  const upcomingEvents = [
    { title: "Team Meeting", date: "2024-04-28", type: "meeting" },
    { title: "Project Deadline", date: "2024-05-15", type: "milestone" },
    { title: "Client Review", date: "2024-05-01", type: "meeting" },
  ];

  const timelineStages = {
    ux: [
      { title: "Research", progress: 100 },
      { title: "Wireframing", progress: 80 },
      { title: "Prototyping", progress: 60 },
      { title: "Testing", progress: 30 },
    ],
    api: [
      { title: "Design", progress: 100 },
      { title: "Implementation", progress: 70 },
      { title: "Testing", progress: 40 },
      { title: "Documentation", progress: 20 },
    ],
  };

  const currentTasks = [
    {
      title: "Implement user authentication",
      assignee: "John D.",
      status: "in-progress",
    },
    {
      title: "Fix mobile responsiveness",
      assignee: "Sarah M.",
      status: "pending",
    },
    {
      title: "Update documentation",
      assignee: "Mike R.",
      status: "in-progress",
    },
  ];

  const requests = [
    { title: "Add dark mode", status: "pending", priority: "medium" },
    { title: "Optimize image loading", status: "pending", priority: "high" },
    { title: "Update API endpoints", status: "completed", priority: "low" },
  ];

  const recentFiles = [
    { name: "Project Requirements.pdf", type: "document" },
    { name: "Wireframes.fig", type: "design" },
    { name: "API Documentation.md", type: "document" },
  ];

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Welcome back, Aaron!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Last active: 2 hours ago
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Admin</Badge>
                <span className="text-sm text-muted-foreground">Role</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm font-medium">Projects</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tasks</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <div className=" px-6 grid grid-cols-5">
            <div className="bg-muted col-span-2">
              <Image
                src="https://qcpaanr39l6dixw3.public.blob.vercel-storage.com/instantemp-login-RnBZeENGaVe6FxqD2IukX2oA2fB0DG"
                alt="Instantemp"
                width={1920}
                height={1080}
                className="w-full h-full object-cover rounded-lg opacity-75 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <div className="col-span-3">
              <CardHeader>
                <CardTitle>Instantemp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    www.instantemp.com
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium mb-1 text-muted-foreground">
                    Domains
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://instantemp.com"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      instantemp.com
                    </a>
                    <Badge variant="secondary">+2</Badge>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div>
                    <p className="text-xs font-medium mb-1 text-muted-foreground">
                      Status
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm">Ready</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1 text-muted-foreground">
                      Created
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">
                        April 29, 2025{" "}
                        <span className="text-muted-foreground">by</span>{" "}
                        aj0urdain
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium mb-1 text-muted-foreground">
                    Source
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      <span className="text-sm">master</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4" />

                      <span className="text-sm">b6c0a88</span>
                      <span className="text-sm text-muted-foreground">
                        fix: incorrect role display
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>

      <Separator className="my-8" />

      <Card className="w-full h-full max-h-[450px]">
        <CardHeader>
          <CardTitle>Website Traffic</CardTitle>
          <CardDescription>
            Showing total visitors for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full max-h-[300px] w-full px-0">
          <ChartContainer
            config={chartConfig}
            className="h-full max-h-[250px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
              height={25}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(221.2 83.2% 53.3%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(221.2 83.2% 53.3%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(142.1 76.2% 36.3%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(142.1 76.2% 36.3%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                fillOpacity={0.4}
                stroke="hsl(142.1 76.2% 36.3%)"
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                fillOpacity={0.4}
                stroke="hsl(221.2 83.2% 53.3%)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                January - June 2025
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Shared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
              <div className="col-span-4 space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.title} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ux" onValueChange={setActiveTimeline}>
              <TabsList>
                <TabsTrigger value="ux">UX</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>
              <TabsContent value="ux" className="space-y-4">
                {timelineStages.ux.map((stage) => (
                  <div key={stage.title}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{stage.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {stage.progress}%
                      </span>
                    </div>
                    <Progress value={stage.progress} />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="api" className="space-y-4">
                {timelineStages.api.map((stage) => (
                  <div key={stage.title}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{stage.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {stage.progress}%
                      </span>
                    </div>
                    <Progress value={stage.progress} />
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentTasks.map((task) => (
                <div
                  key={task.title}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.assignee}
                    </p>
                  </div>
                  <Badge
                    variant={
                      task.status === "in-progress" ? "default" : "outline"
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="space-y-4">
                {requests
                  .filter((req) => req.status === "pending")
                  .map((req) => (
                    <div
                      key={req.title}
                      className="flex items-center justify-between"
                    >
                      <p className="font-medium">{req.title}</p>
                      <Badge
                        variant={
                          req.priority === "high" ? "destructive" : "secondary"
                        }
                      >
                        {req.priority}
                      </Badge>
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {requests
                  .filter((req) => req.status === "completed")
                  .map((req) => (
                    <div
                      key={req.title}
                      className="flex items-center justify-between"
                    >
                      <p className="font-medium">{req.title}</p>
                      <Badge variant="outline">completed</Badge>
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file.name} className="flex items-center gap-2">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <span>{file.name}</span>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="documents" className="space-y-4">
              {recentFiles
                .filter((file) => file.type === "document")
                .map((file) => (
                  <div key={file.name} className="flex items-center gap-2">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <span>{file.name}</span>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="design" className="space-y-4">
              {recentFiles
                .filter((file) => file.type === "design")
                .map((file) => (
                  <div key={file.name} className="flex items-center gap-2">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <span>{file.name}</span>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
