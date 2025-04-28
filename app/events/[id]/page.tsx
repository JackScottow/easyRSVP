import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin, Share2 } from "lucide-react";

import prisma from "@/lib/prisma";
import { rsvp_response } from "@prisma/client";
import { format } from "date-fns";

// Function to fetch event data
async function getEventData(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        // Include RSVPs to calculate stats
        rsvps: {
          select: {
            response: true, // Select only the response field
          },
        },
        // Optionally include user if needed (e.g., show creator)
        // user: {
        //   select: {
        //     email: true, // Example: select user email
        //   },
        // },
      },
    });

    if (!event) {
      notFound(); // Trigger 404 if event not found
    }

    // Calculate RSVP counts
    const rsvpCounts = event.rsvps.reduce(
      (acc, rsvp) => {
        if (rsvp.response === rsvp_response.yes) acc.yes++;
        else if (rsvp.response === rsvp_response.no) acc.no++;
        else if (rsvp.response === rsvp_response.maybe) acc.maybe++;
        return acc;
      },
      { yes: 0, no: 0, maybe: 0 }
    );

    // Return event data along with calculated counts
    return { ...event, rsvpCounts };
  } catch (error) {
    console.error("Failed to fetch event:", error);
    // Handle other potential errors, perhaps trigger a generic error page
    // For now, re-throwing or triggering notFound might be appropriate
    notFound();
  }
}

// Make page component async
export default async function EventDetailPage({ params }: { params: { id: string } }) {
  // Fetch the event data
  const event = await getEventData(params.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container max-w-4xl px-4 py-6 md:py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
              <div className="mt-2 flex flex-col gap-2 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {format(new Date(event.event_date), "h:mm a")}
                </div>
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>

            {event.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/events/${params.id}/rsvp`}>RSVP to Event</Link>
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Event
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RSVP Stats</CardTitle>
                <CardDescription>Current response count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Yes</span>
                    <span className="font-medium text-green-600">{event.rsvpCounts.yes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No</span>
                    <span className="font-medium text-red-600">{event.rsvpCounts.no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maybe</span>
                    <span className="font-medium text-amber-600">{event.rsvpCounts.maybe}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">{event.rsvpCounts.yes + event.rsvpCounts.no + event.rsvpCounts.maybe}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>Scan to RSVP</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="relative h-48 w-48">
                  <Image src="/placeholder.svg?height=200&width=200" alt="QR Code placeholder" width={200} height={200} className="border p-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
