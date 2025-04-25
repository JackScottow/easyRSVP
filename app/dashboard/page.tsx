import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, LogOut, PlusCircle } from "lucide-react";

// Sample event data
const events = [
  {
    id: "1",
    title: "Team Building Workshop",
    date: "2025-05-15",
    rsvpCount: { yes: 12, no: 3, maybe: 5 },
  },
  {
    id: "2",
    title: "Product Launch Party",
    date: "2025-06-20",
    rsvpCount: { yes: 45, no: 8, maybe: 12 },
  },
  {
    id: "3",
    title: "Annual Company Picnic",
    date: "2025-07-10",
    rsvpCount: { yes: 28, no: 6, maybe: 9 },
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">EasyRSVP</h1>
          <div className="flex items-center gap-4">
            <p className="hidden text-sm text-muted-foreground md:block">Welcome, User!</p>
            <Button variant="outline" size="icon">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Your Events</h2>
          <Button asChild>
            <Link href="/events/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No events yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">Create your first event to get started.</p>
            <Button asChild>
              <Link href="/events/create">Create Event</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="block">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-3 text-sm">
                      <span className="text-green-600">{event.rsvpCount.yes} Yes</span>
                      <span className="text-red-600">{event.rsvpCount.no} No</span>
                      <span className="text-amber-600">{event.rsvpCount.maybe} Maybe</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
