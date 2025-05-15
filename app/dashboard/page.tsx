import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type RsvpRecord = { event_id: string; response: "yes" | "no" | "maybe" };
type Event = {
  id: string;
  title: string;
  event_date: string;
  yesCount: number;
  noCount: number;
  maybeCount: number;
  image_url?: string;
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: baseEvents, error: eventsError } = await supabase.from("events").select("id, title, event_date, image_url").eq("user_id", user.id).order("event_date", { ascending: false });

  if (eventsError) {
    console.error("Error fetching events (handled):", eventsError.message);

    return <div>Error loading events.</div>;
  }

  const initialEvents = baseEvents || [];
  const eventIds = initialEvents.map((event) => event.id);

  let rsvpCountsMap: { [eventId: string]: { yes: number; no: number; maybe: number } } = {};

  if (eventIds.length > 0) {
    const { data: rsvps, error: rsvpsError } = await supabase.from("rsvps").select("event_id, response").in("event_id", eventIds).in("response", ["yes", "no", "maybe"]);

    if (rsvpsError) {
      console.error("Error fetching RSVPs (handled):", rsvpsError.message);
    } else if (rsvps) {
      rsvpCountsMap = (rsvps as RsvpRecord[]).reduce((acc, rsvp) => {
        if (!acc[rsvp.event_id]) {
          acc[rsvp.event_id] = { yes: 0, no: 0, maybe: 0 };
        }
        if (rsvp.response === "yes") acc[rsvp.event_id].yes++;
        else if (rsvp.response === "no") acc[rsvp.event_id].no++;
        else if (rsvp.response === "maybe") acc[rsvp.event_id].maybe++;
        return acc;
      }, {} as typeof rsvpCountsMap);
    }
  }

  const eventsWithCounts: Event[] = initialEvents.map((event) => {
    const counts = rsvpCountsMap[event.id] || { yes: 0, no: 0, maybe: 0 };
    return {
      ...event,
      yesCount: counts.yes,
      noCount: counts.no,
      maybeCount: counts.maybe,
    };
  });

  const fetchedEvents: Event[] = eventsWithCounts;

  return (
    <div className="min-h-screen bg-background">
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

        {fetchedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No events yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">Create your first event to get started.</p>
            <Button asChild>
              <Link href="/events/create">Create Event</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fetchedEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="block">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    {event.image_url ? <img src={event.image_url} alt="Event" className="rounded mb-2 w-full max-w-full h-auto" style={{ display: "block", margin: "0 auto" }} /> : <div className="rounded bg-muted flex items-center justify-center mb-2 max-h-32 w-full h-24 text-muted-foreground text-sm">No image</div>}
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Date not set"}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-evenly w-full text-sm">
                      <span className="text-green-600">{event.yesCount} Yes</span>
                      <span className="text-red-600">{event.noCount} No</span>
                      <span className="text-amber-600">{event.maybeCount} Maybe</span>
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
