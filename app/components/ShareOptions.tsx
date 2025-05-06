"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Download, Copy, Calendar, Facebook, Twitter, Mail, MessageCircle, PhoneCall, Smartphone } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { toast } from "sonner";

// Define the props for the component
interface ShareOptionsProps {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation?: string;
  eventDescription?: string;
}

export function ShareOptions({ eventId, eventTitle, eventDate, eventLocation, eventDescription }: ShareOptionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Event URL construction
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const eventUrl = `${baseUrl}/events/${eventId}`;
  const rsvpUrl = `${eventUrl}/rsvp`;

  // Function to copy URL to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  // Function to download QR code
  const downloadQRCode = () => {
    const canvas = document.getElementById("event-qr-code") as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${eventTitle.replace(/\s+/g, "-")}-QR.png`;
    link.href = url;
    link.click();
  };

  // Handle Web Share API
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: eventTitle,
          text: `RSVP to ${eventTitle}!`,
          url: rsvpUrl,
        })
        .then(() => toast.success("Shared successfully!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      setIsModalOpen(true);
    }
  };

  // Generate calendar links
  const generateGoogleCalLink = () => {
    const startDate = encodeURIComponent(eventDate.toISOString().replace(/-|:|\.\d+/g, ""));
    const endDate = encodeURIComponent(new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, ""));
    const details = encodeURIComponent(`${eventDescription || ""}\n\nRSVP: ${rsvpUrl}`);
    const location = encodeURIComponent(eventLocation || "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  // Generate ICS file content
  const generateICSContent = () => {
    const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, "");
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, "");

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RSVP App//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${eventTitle}
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:${eventDescription || ""}\nRSVP: ${rsvpUrl}
LOCATION:${eventLocation || ""}
URL:${rsvpUrl}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
  };

  // Function to download ICS file
  const downloadICSFile = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${eventTitle.replace(/\s+/g, "-")}.ics`;
    link.click();
  };

  // Generate social media share links
  const generateFacebookShareLink = () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(rsvpUrl)}`;

  const generateTwitterShareLink = () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`RSVP to ${eventTitle}!`)}&url=${encodeURIComponent(rsvpUrl)}`;

  const generateEmailShareLink = () => {
    const subject = encodeURIComponent(`Invitation: ${eventTitle}`);
    const body = encodeURIComponent(`Hi,\n\nI'd like to invite you to ${eventTitle}.\n\n` + `Date: ${eventDate.toLocaleDateString()}\n` + `Time: ${eventDate.toLocaleTimeString()}\n` + (eventLocation ? `Location: ${eventLocation}\n\n` : "\n") + `RSVP here: ${rsvpUrl}\n\n` + (eventDescription ? `Details: ${eventDescription}` : ""));
    return `mailto:?subject=${subject}&body=${body}`;
  };

  const generateWhatsAppShareLink = () => {
    const text = encodeURIComponent(`RSVP to ${eventTitle}!\n\n` + `Date: ${eventDate.toLocaleDateString()}\n` + `Time: ${eventDate.toLocaleTimeString()}\n` + (eventLocation ? `Location: ${eventLocation}\n\n` : "\n") + `RSVP here: ${rsvpUrl}`);
    return `https://wa.me/?text=${text}`;
  };

  const generateSMSShareLink = () => {
    const text = encodeURIComponent(`RSVP to ${eventTitle}! Link: ${rsvpUrl}`);
    return `sms:?body=${text}`;
  };

  const generateTelegramShareLink = () => {
    const text = encodeURIComponent(`RSVP to ${eventTitle}!\n\n` + `Date: ${eventDate.toLocaleDateString()}\n` + `Time: ${eventDate.toLocaleTimeString()}\n` + (eventLocation ? `Location: ${eventLocation}\n\n` : "\n") + `RSVP here: ${rsvpUrl}`);
    return `https://t.me/share/url?url=${encodeURIComponent(rsvpUrl)}&text=${text}`;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="mr-2 h-5 w-5" />
          Share This Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="qr">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="link">Direct Link</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="qr" className="space-y-4">
            <div className="flex justify-center py-4">
              <QRCode id="event-qr-code" value={rsvpUrl} size={200} level="H" includeMargin={true} />
            </div>
            <Button onClick={downloadQRCode} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <a href={generateFacebookShareLink()} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
              </a>
              <a href={generateTwitterShareLink()} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
              </a>
              <a href={generateWhatsAppShareLink()} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
              <a href={generateTelegramShareLink()} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Telegram
                </Button>
              </a>
              <a href={generateSMSShareLink()}>
                <Button variant="outline" className="w-full">
                  <Smartphone className="mr-2 h-4 w-4" />
                  SMS
                </Button>
              </a>
              <a href={generateEmailShareLink()}>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </a>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="text" value={rsvpUrl} readOnly className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              <Button variant="outline" onClick={() => copyToClipboard(rsvpUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <a href={generateGoogleCalLink()} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Google Calendar
                </Button>
              </a>
              <Button variant="outline" className="w-full" onClick={downloadICSFile}>
                <Calendar className="mr-2 h-4 w-4" />
                Download .ics (Apple, Outlook)
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
