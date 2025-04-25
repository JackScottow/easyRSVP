"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, ThumbsDown, ThumbsUp, HelpCircle } from "lucide-react"

// In a real app, you would fetch this data based on the event ID
const event = {
  id: "1",
  title: "Team Building Workshop",
  date: "2025-05-15",
  time: "14:00",
  location: "Conference Room A, Main Office",
  description:
    "Join us for a fun and interactive team building workshop designed to improve collaboration and communication within our team.",
}

export default function RsvpPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [response, setResponse] = useState<"yes" | "no" | "maybe" | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit this data to your backend
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-lg px-4 py-6 md:py-10">
        <Card className="mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <CardDescription>
              <div className="mt-2 flex flex-col items-center gap-1 text-muted-foreground">
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
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="text-2xl font-semibold">Thank you!</div>
                <p>Your RSVP has been recorded.</p>
                <Button asChild className="mt-4">
                  <Link href={`/events/${params.id}`}>View Event Details</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Will you attend?</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant={response === "yes" ? "default" : "outline"}
                      className="flex-1 gap-2"
                      onClick={() => setResponse("yes")}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={response === "no" ? "default" : "outline"}
                      className="flex-1 gap-2"
                      onClick={() => setResponse("no")}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      No
                    </Button>
                    <Button
                      type="button"
                      variant={response === "maybe" ? "default" : "outline"}
                      className="flex-1 gap-2"
                      onClick={() => setResponse("maybe")}
                    >
                      <HelpCircle className="h-4 w-4" />
                      Maybe
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={!name || !email || !response}>
                  Submit RSVP
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
