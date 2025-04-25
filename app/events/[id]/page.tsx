import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, MapPin, Share2 } from "lucide-react"

// In a real app, you would fetch this data based on the event ID
const event = {
  id: "1",
  title: "Team Building Workshop",
  date: "2025-05-15",
  time: "14:00",
  location: "Conference Room A, Main Office",
  description:
    "Join us for a fun and interactive team building workshop designed to improve collaboration and communication within our team. We'll have various activities and exercises followed by refreshments.",
  rsvpCount: { yes: 12, no: 3, maybe: 5 },
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium">
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
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

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
                    <span className="font-medium text-green-600">{event.rsvpCount.yes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No</span>
                    <span className="font-medium text-red-600">{event.rsvpCount.no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maybe</span>
                    <span className="font-medium text-amber-600">{event.rsvpCount.maybe}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">
                      {event.rsvpCount.yes + event.rsvpCount.no + event.rsvpCount.maybe}
                    </span>
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
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="QR Code for RSVP"
                    width={200}
                    height={200}
                    className="border p-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
