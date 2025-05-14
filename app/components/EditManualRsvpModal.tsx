"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThumbsDown, ThumbsUp, HelpCircle, Pencil } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export enum rsvp_response {
  yes = "yes",
  no = "no",
  maybe = "maybe",
}

interface RsvpData {
  id: string;
  name: string;
  email: string;
  response: rsvp_response;
  comment: string | null;
}

interface EditManualRsvpModalProps {
  eventId: string;
  rsvp: RsvpData;
  onUpdate: () => void;
}

export function EditManualRsvpModal({ eventId, rsvp, onUpdate }: EditManualRsvpModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: rsvp.name,
    email: rsvp.email,
    response: rsvp.response,
    comment: rsvp.comment || "",
  });

  // Update form data when rsvp prop changes
  useEffect(() => {
    setFormData({
      name: rsvp.name,
      email: rsvp.email,
      response: rsvp.response,
      comment: rsvp.comment || "",
    });
  }, [rsvp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResponseChange = (value: string) => {
    setFormData({
      ...formData,
      response: value as rsvp_response,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/events/${eventId}/manual-rsvp/${rsvp.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update RSVP");
      }

      toast({
        title: "Success",
        description: "RSVP updated successfully",
      });

      onUpdate();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update RSVP",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this RSVP?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/events/${eventId}/manual-rsvp/${rsvp.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete RSVP");
      }

      toast({
        title: "Success",
        description: "RSVP deleted successfully",
      });

      onUpdate();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete RSVP",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit RSVP</DialogTitle>
          <DialogDescription>Make changes to this RSVP.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Response</Label>
              <div className="col-span-3">
                <RadioGroup value={formData.response} onValueChange={handleResponseChange} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={rsvp_response.yes} id="edit-rsvp-yes" />
                    <Label htmlFor="edit-rsvp-yes" className="flex items-center gap-2 font-normal cursor-pointer">
                      <ThumbsUp className="h-4 w-4" /> Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={rsvp_response.no} id="edit-rsvp-no" />
                    <Label htmlFor="edit-rsvp-no" className="flex items-center gap-2 font-normal cursor-pointer">
                      <ThumbsDown className="h-4 w-4" /> No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={rsvp_response.maybe} id="edit-rsvp-maybe" />
                    <Label htmlFor="edit-rsvp-maybe" className="flex items-center gap-2 font-normal cursor-pointer">
                      <HelpCircle className="h-4 w-4" /> Maybe
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-comment" className="text-right">
                Comment
              </Label>
              <Textarea id="edit-comment" name="comment" value={formData.comment} onChange={handleChange} className="col-span-3" placeholder="Optional comment" />
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isSubmitting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
              <Button type="submit" disabled={isSubmitting || isDeleting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
