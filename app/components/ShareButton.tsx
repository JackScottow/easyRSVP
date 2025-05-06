"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation?: string;
}

export function ShareButton({ eventId, eventTitle, eventDate, eventLocation }: ShareButtonProps) {
  // Event URL construction
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const eventUrl = `${baseUrl}/events/${eventId}`;
  const rsvpUrl = `${eventUrl}/rsvp`;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: eventTitle,
          text: `RSVP to ${eventTitle}${eventLocation ? ` at ${eventLocation}` : ""} on ${eventDate.toLocaleDateString()}!`,
          url: rsvpUrl,
        })
        .then(() => toast.success("Shared successfully!"))
        .catch((error) => {
          console.error("Error sharing:", error);
          // Fallback to copy to clipboard if share fails
          copyToClipboard(rsvpUrl);
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(rsvpUrl);
    }
  };

  // Function to copy URL to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("RSVP link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  return (
    <Button variant="outline" onClick={handleShare}>
      <Share2 className="mr-2 h-4 w-4" />
      Share RSVP
    </Button>
  );
}
