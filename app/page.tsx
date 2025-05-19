"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, QrCode, ArrowRight } from "lucide-react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedItem } from "@/components/ui/animated-section";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { fadeIn, fadeInScale, slideIn, textVariant } from "@/utils/animations";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary/10 py-12 md:py-20 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <AnimatedSection variants={fadeIn("right", 0.2)}>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <motion.h1 variants={textVariant(0.3)} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-secondary">
                    Simplify Event Planning & RSVPs
                  </motion.h1>
                  <motion.p variants={textVariant(0.4)} className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create events, collect RSVPs, and manage attendees all in one place. The easiest way to plan your next gathering.
                  </motion.p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <AnimatedButton animate={false} size="lg" asChild>
                    <Link href="/register">Get Started</Link>
                  </AnimatedButton>
                  <AnimatedButton animate={false} size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white" asChild>
                    <Link href="#features">Learn More</Link>
                  </AnimatedButton>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection variants={fadeIn("left", 0.4)}>
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    delay: 0.5,
                    duration: 0.8,
                  }}
                  className="relative h-[350px] w-full max-w-[500px] overflow-hidden rounded-lg shadow-xl bg-white">
                  <Image src="/hero.png" alt="EasyRSVP Dashboard" fill className="object-contain p-4" priority />
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <AnimatedSection staggerItems={false}>
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <motion.h2 variants={textVariant()} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary">
                Features
              </motion.h2>
              <motion.p variants={textVariant(0.1)} className="max-w-[85%] text-muted-foreground md:text-xl">
                Everything you need to manage your events and collect RSVPs efficiently.
              </motion.p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3" staggerItems={true} staggerDelay={0.1}>
            <AnimatedItem variants={fadeInScale(0.1)}>
              <AnimatedCard animate={false} className="flex flex-col items-center text-center">
                <CardHeader>
                  <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Calendar className="mx-auto w-12 h-12 text-primary" />
                  </motion.div>
                  <CardTitle>Event Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Create beautiful event pages with all the details your guests need to know.</CardDescription>
                </CardContent>
              </AnimatedCard>
            </AnimatedItem>

            <AnimatedItem variants={fadeInScale(0.2)}>
              <AnimatedCard animate={false} className="flex flex-col items-center text-center">
                <CardHeader>
                  <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <Users className="mx-auto w-12 h-12 text-primary" />
                  </motion.div>
                  <CardTitle>RSVP Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Collect and manage RSVPs with ease. Track yes, no, and maybe responses.</CardDescription>
                </CardContent>
              </AnimatedCard>
            </AnimatedItem>

            <AnimatedItem variants={fadeInScale(0.3)}>
              <AnimatedCard animate={false} className="flex flex-col items-center text-center">
                <CardHeader>
                  <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <QrCode className="mx-auto w-12 h-12 text-primary" />
                  </motion.div>
                  <CardTitle>QR Code Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Generate QR codes for your events to make it easy for guests to RSVP on the go.</CardDescription>
                </CardContent>
              </AnimatedCard>
            </AnimatedItem>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/5 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <AnimatedSection>
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <motion.h2 variants={textVariant()} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </motion.h2>
              <motion.p variants={textVariant(0.1)} className="max-w-[85%] text-muted-foreground md:text-xl">
                Get started in minutes with our simple three-step process.
              </motion.p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3" staggerItems={true} staggerDelay={0.15}>
            <AnimatedItem variants={slideIn("up", 0.1)}>
              <div className="flex flex-col items-center text-center">
                <motion.div whileHover={{ scale: 1.1, backgroundColor: "var(--color-primary-dark)" }} transition={{ type: "spring", stiffness: 300, damping: 10 }} className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </motion.div>
                <h3 className="mt-4 text-xl font-bold">Create an Event</h3>
                <p className="mt-2 text-muted-foreground">Sign up and create your first event with all the important details.</p>
              </div>
            </AnimatedItem>

            <AnimatedItem variants={slideIn("up", 0.2)}>
              <div className="flex flex-col items-center text-center">
                <motion.div whileHover={{ scale: 1.1, backgroundColor: "var(--color-primary-dark)" }} transition={{ type: "spring", stiffness: 300, damping: 10 }} className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </motion.div>
                <h3 className="mt-4 text-xl font-bold">Share with Guests</h3>
                <p className="mt-2 text-muted-foreground">Share your event link or QR code with your guests via email, social media, or text.</p>
              </div>
            </AnimatedItem>

            <AnimatedItem variants={slideIn("up", 0.3)}>
              <div className="flex flex-col items-center text-center">
                <motion.div whileHover={{ scale: 1.1, backgroundColor: "var(--color-primary-dark)" }} transition={{ type: "spring", stiffness: 300, damping: 10 }} className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </motion.div>
                <h3 className="mt-4 text-xl font-bold">Track Responses</h3>
                <p className="mt-2 text-muted-foreground">Monitor RSVPs in real-time and communicate with your guests as needed.</p>
              </div>
            </AnimatedItem>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <AnimatedSection>
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <motion.h2 variants={textVariant()} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Users Say
              </motion.h2>
              <motion.p variants={textVariant(0.1)} className="max-w-[85%] text-muted-foreground md:text-xl">
                Don't just take our word for it. Here's what people are saying about our app.
              </motion.p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3" staggerItems={true} staggerDelay={0.1}>
            {testimonials.map((testimonial: Testimonial, index: number) => (
              <AnimatedItem key={index} variants={fadeInScale(0.1 * (index + 1))}>
                <AnimatedCard animate={false} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <motion.div whileHover={{ scale: 1.1 }} className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image src={`/user${index + 1}.png`} alt={testimonial.name} fill className="object-cover" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{testimonial.quote}</p>
                  </CardContent>
                </AnimatedCard>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <AnimatedSection variants={fadeIn("up", 0.2)}>
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <motion.h2 variants={textVariant(0.1)} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Simplify Your Event Planning?
              </motion.h2>
              <motion.p variants={textVariant(0.2)} className="max-w-[85%] md:text-xl">
                Join thousands of event organizers who trust our platform for their RSVP needs.
              </motion.p>
              <AnimatedButton size="lg" variant="secondary" className="mt-4" animate={false} asChild>
                <Link href="/register">
                  <motion.div className="flex items-center">
                    Get Started for Free
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.span>
                  </motion.div>
                </Link>
              </AnimatedButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

// Sample testimonial data
const testimonials: Testimonial[] = [
  {
    name: "Michael Johnson",
    role: "Event Planner",
    quote: "This app has completely transformed how I manage RSVPs for my clients' events. The QR code feature is a game-changer!",
  },
  {
    name: "Lisa Smith",
    role: "Wedding Coordinator",
    quote: "I've tried many RSVP tools, but this one stands out for its simplicity and powerful features. My couples love it!",
  },
  {
    name: "Shaun Williams",
    role: "Corporate Event Manager",
    quote: "Managing attendees for our company events used to be a nightmare. This app has made the process so much easier.",
  },
];
