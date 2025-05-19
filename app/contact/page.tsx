"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2, Github, Twitter, Linkedin } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully! We'll get back to you soon.");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">Contact Us</h1>
          <p className="text-muted-foreground text-center mt-3 max-w-2xl mx-auto">Have questions or feedback? We're here to help. Drop us a message and we'll get back to you as soon as possible.</p>
        </div>

        {/* Contact Form */}
        <Card className="border shadow-sm mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll respond shortly</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input id="name" name="name" required placeholder="Your name" className="w-full" autoComplete="name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input id="email" name="email" type="email" required placeholder="your.email@example.com" className="w-full" autoComplete="email" />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium flex items-center gap-1">
                  Subject <span className="text-destructive">*</span>
                </label>
                <Input id="subject" name="subject" required placeholder="What's this about?" className="w-full" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium flex items-center gap-1">
                  Message <span className="text-destructive">*</span>
                </label>
                <Textarea id="message" name="message" required placeholder="Your message..." className="min-h-[150px] w-full resize-y" />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-2">We respect your privacy and will never share your information.</p>
            </form>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Connect With Us</CardTitle>
            <CardDescription>Follow us on social media</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-6">
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-muted p-3 hover:bg-primary/10 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-muted p-3 hover:bg-primary/10 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-muted p-3 hover:bg-primary/10 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Response time: Usually within 24-48 hours on business days.</p>
        </div>
      </div>
    </main>
  );
}
