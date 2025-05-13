"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface EditEventModalProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    event_date: Date;
    location: string | null;
  };
}

export function EditEventModal({ event }: EditEventModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || "",
    event_date: format(new Date(event.event_date), "yyyy-MM-dd"),
    event_time: format(new Date(event.event_date), "HH:mm"),
    location: event.location || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          event_date: new Date(`${formData.event_date}T${formData.event_time}`).toISOString(),
          location: formData.location,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      toast.success("Event updated successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update event");
      console.error("Error updating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex-1">
          Edit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Make changes to your event details here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event_date">Date</Label>
              <Input id="event_date" type="date" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event_time">Time</Label>
              <Input id="event_time" type="time" value={formData.event_time} onChange={(e) => setFormData({ ...formData, event_time: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Enter event location" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
