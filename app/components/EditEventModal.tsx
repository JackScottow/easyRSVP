"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import imageCompression from "browser-image-compression";

interface EditEventModalProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    event_date: Date;
    location: string | null;
    image_url?: string;
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
  const [imageUrl, setImageUrl] = useState(event.image_url || "");
  const [showCropper, setShowCropper] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle image file selection and upload immediately
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createSupabaseBrowserClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log("Current user:", userData, userError);
    // Delete old image if it exists
    if (imageUrl) {
      // Remove cache busting if present
      const cleanUrl = imageUrl.split("?")[0];
      // Extract the file path after the bucket name
      const idx = cleanUrl.indexOf("/event-images/");
      if (idx !== -1) {
        const filePath = cleanUrl.substring(idx + "/event-images/".length);
        if (filePath) {
          const { error: removeError } = await supabase.storage.from("event-images").remove([filePath]);
          if (removeError) {
            console.warn("Failed to delete old image:", removeError.message);
          }
        }
      }
    }
    // Compress the image
    const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true });
    console.log("Uploading file:", {
      name: compressedFile.name,
      size: compressedFile.size,
      type: compressedFile.type,
    });
    const filePath = `events/${event.id}.jpg`;
    const { error, data } = await supabase.storage.from("event-images").upload(filePath, compressedFile, { upsert: true });
    console.log("Supabase upload result:", { data, error, filePath });
    if (error) {
      toast.error("Image upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from("event-images").getPublicUrl(filePath);
    setImageUrl(publicUrlData.publicUrl + `?t=${Date.now()}`); // cache busting
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle image removal
  const handleRemoveImage = async () => {
    if (!imageUrl) return;
    setUploading(true);
    const supabase = createSupabaseBrowserClient();
    // Remove cache busting if present
    const cleanUrl = imageUrl.split("?")[0];
    const idx = cleanUrl.indexOf("/event-images/");
    if (idx !== -1) {
      const filePath = cleanUrl.substring(idx + "/event-images/".length);
      if (filePath) {
        const { error: removeError } = await supabase.storage.from("event-images").remove([filePath]);
        if (removeError) {
          toast.error("Failed to delete image: " + removeError.message);
        } else {
          setImageUrl("");
          toast.success("Image removed!");
        }
      }
    }
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          image_url: imageUrl || null,
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            <div className="grid gap-2">
              <Label>Event Image</Label>
              {imageUrl ? <img src={imageUrl} alt="Event" className="rounded mb-2 w-full max-w-full h-auto" style={{ display: "block", margin: "0 auto" }} /> : <div className="rounded bg-muted flex items-center justify-center mb-2 max-h-32 w-full h-24 text-muted-foreground text-sm">No image</div>}
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} ref={fileInputRef} />
              {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              {imageUrl && (
                <Button type="button" variant="destructive" onClick={handleRemoveImage} disabled={uploading}>
                  Remove Image
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || uploading}>
              {isLoading ? "Saving..." : uploading ? "Uploading Image..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
