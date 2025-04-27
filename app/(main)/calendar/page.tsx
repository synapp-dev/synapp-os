"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto space-y-6 px-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              {date ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {format(date, "MMMM d, yyyy")}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    No events scheduled for this day.
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Select a date to view events.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
