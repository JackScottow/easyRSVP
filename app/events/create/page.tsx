"use client"; // Required for using hooks like useFormState

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Assuming you have toast for messages

// Import the server action and its state type
import { createEventAction, type CreateEventFormState } from "./_actions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

const Cropper = dynamic(() => import("react-cropper"), { ssr: false });

// Component to handle button pending state
function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending || disabled} disabled={pending || disabled}>
      {pending ? "Creating..." : "Create Event"}
    </Button>
  );
}

export default function CreateEventPage() {
  const { toast } = useToast(); // Initialize toast
  const router = useRouter();

  const initialState: CreateEventFormState = {
    message: null,
    errors: {},
    success: false,
  };

  // useFormState hook to manage form submission and feedback
  const [state, formAction] = useFormState(createEventAction, initialState);

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [cropperSrc, setCropperSrc] = useState<string | undefined>(undefined);
  const [cropperInstance, setCropperInstance] = useState<any>(null);
  const fileInputRef = useRef(null);

  // Show toast message on success or error
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        // Immediate redirect to the new event page
        if (state.eventId) {
          router.replace(`/events/${state.eventId}`);
        }
      } else {
        toast({ title: "Error", description: state.message, variant: "destructive" });
      }
    }
  }, [state, toast]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show cropper modal with selected image
    setCropperSrc(URL.createObjectURL(file));
    setShowCropper(true);
  }

  async function handleCropAndUpload() {
    if (!cropperInstance) return;
    setUploading(true);
    // Get cropped image as a Blob
    const canvas = cropperInstance.getCroppedCanvas({ maxWidth: 1200, maxHeight: 1200 });
    if (!canvas) {
      setUploading(false);
      setShowCropper(false);
      return;
    }
    const blob: Blob = await new Promise((resolve) => canvas.toBlob(resolve as any, "image/jpeg", 0.9));
    // Compress the cropped image
    const croppedFile = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    const compressedFile = await imageCompression(croppedFile, { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true });
    // Upload to Supabase
    const supabase = createSupabaseBrowserClient();
    const filePath = `events/${Date.now()}_event.jpg`;
    const { error } = await supabase.storage.from("event-images").upload(filePath, compressedFile);
    if (error) {
      alert("Image upload failed: " + error.message);
      setUploading(false);
      setShowCropper(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from("event-images").getPublicUrl(filePath);
    setImageUrl(publicUrlData.publicUrl);
    setUploading(false);
    setShowCropper(false);
  }

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

      <main className="container max-w-2xl px-4 py-6 md:py-10">
        {/* Bind the server action to the form */}
        <form action={formAction}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Event</CardTitle>
              <CardDescription>Fill in the details to create your new event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display general form error message */}
              {state.errors?._form && <div className="text-sm font-medium text-destructive">{state.errors._form.join(", ")}</div>}

              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" placeholder="Enter event title" required />
                {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title.join(", ")}</p>}
              </div>

              {/* Event Date */}
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input id="event_date" name="event_date" type="date" required />
                {state.errors?.event_date && (
                  <p className="text-sm font-medium text-destructive">
                    {state.errors.event_date.join(", ")} {/* Date/Time combo error shown here */}
                  </p>
                )}
              </div>

              {/* Event Time */}
              <div className="space-y-2">
                <Label htmlFor="event_time">Event Time</Label>
                <Input id="event_time" name="event_time" type="time" required />
                {/* Specific time error isn't separated in Zod schema, shown under Date */}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input id="location" name="location" placeholder="Enter event location" />
                {state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location.join(", ")}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" placeholder="Provide details about your event" className="min-h-[120px]" />
                {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description.join(", ")}</p>}
              </div>

              {/* Event Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="event_image">Event Image (Optional)</Label>
                <Input id="event_image" name="event_image" type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} disabled={uploading} />
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                {imageUrl && (
                  <div className="mt-2">
                    <img src={imageUrl} alt="Event" className="max-h-40 rounded" />
                    <input type="hidden" name="image_url" value={imageUrl} />
                  </div>
                )}
              </div>

              {/* Cropper Modal */}
              {showCropper && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full">
                    <h3 className="mb-2 font-bold">Crop your image</h3>
                    {cropperSrc && (
                      <Cropper
                        src={cropperSrc}
                        style={{ height: 400, width: "100%" }}
                        // aspectRatio={16 / 9} // Optional: lock aspect ratio
                        guides={true}
                        viewMode={1}
                        minCropBoxWidth={100}
                        minCropBoxHeight={100}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        onInitialized={setCropperInstance}
                      />
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                      <Button type="button" variant="outline" onClick={() => setShowCropper(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleCropAndUpload} disabled={uploading}>
                        {uploading ? "Uploading..." : "Crop & Upload"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-6">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              {/* Use the SubmitButton component */}
              <SubmitButton disabled={uploading} />
              {uploading && <p className="text-sm text-muted-foreground">Please wait for the image to finish uploading.</p>}
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  );
}
