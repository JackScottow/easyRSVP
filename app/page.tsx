import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, QrCode, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EasyRSVP</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Button asChild size="sm">
              <Link href="/register">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-12 md:py-20 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">Simplify Event Planning & RSVPs</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">Create events, collect RSVPs, and manage attendees all in one place. The easiest way to plan your next gathering.</p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-full max-w-[500px] overflow-hidden rounded-lg shadow-xl">
                <Image src="/placeholder.svg?height=700&width=1000" alt="EasyRSVP Dashboard" fill className="object-cover" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl">Everything you need to manage your events and collect RSVPs efficiently.</p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary" />
                <CardTitle>Event Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Create beautiful event pages with all the details your guests need to know.</CardDescription>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary" />
                <CardTitle>RSVP Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Collect and manage RSVPs with ease. Track yes, no, and maybe responses.</CardDescription>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <QrCode className="h-12 w-12 text-primary" />
                <CardTitle>QR Code Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Generate QR codes for your events to make it easy for guests to RSVP on the go.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl">Get started in minutes with our simple three-step process.</p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">1</div>
              <h3 className="mt-4 text-xl font-bold">Create an Event</h3>
              <p className="mt-2 text-muted-foreground">Sign up and create your first event with all the important details.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">2</div>
              <h3 className="mt-4 text-xl font-bold">Share with Guests</h3>
              <p className="mt-2 text-muted-foreground">Share your event link or QR code with your guests via email, social media, or text.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">3</div>
              <h3 className="mt-4 text-xl font-bold">Track Responses</h3>
              <p className="mt-2 text-muted-foreground">Monitor RSVPs in real-time and communicate with your guests as needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl">Don't just take our word for it. Here's what people are saying about our app.</p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image src={`/placeholder.svg?height=100&width=100&text=${testimonial.name.charAt(0)}`} alt={testimonial.name} fill className="object-cover" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Simplify Your Event Planning?</h2>
            <p className="max-w-[85%] md:text-xl">Join thousands of event organizers who trust our platform for their RSVP needs.</p>
            <Button size="lg" variant="secondary" className="mt-4" asChild>
              <Link href="/register">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">EasyRSVP</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} EasyRSVP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Sample testimonial data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Planner",
    quote: "This app has completely transformed how I manage RSVPs for my clients' events. The QR code feature is a game-changer!",
  },
  {
    name: "Michael Chen",
    role: "Wedding Coordinator",
    quote: "I've tried many RSVP tools, but this one stands out for its simplicity and powerful features. My couples love it!",
  },
  {
    name: "Jessica Williams",
    role: "Corporate Event Manager",
    quote: "Managing attendees for our company events used to be a nightmare. This app has made the process so much easier.",
  },
];
