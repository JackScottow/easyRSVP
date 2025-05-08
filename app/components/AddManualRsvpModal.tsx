"use client";

import { useState } from "react";
import { rsvp_response } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThumbsDown, ThumbsUp, HelpCircle, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AddManualRsvpModalProps {
  eventId: string;
}

export function AddManualRsvpModal({ eventId }: AddManualRsvpModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    response: rsvp_response.yes as rsvp_response,
    comment: "",
  });

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
      const response = await fetch(`/api/events/${eventId}/manual-rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          email: "manual@rsvp.app", // Use a placeholder email for manual RSVPs
          added_by_owner: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add RSVP");
      }

      toast({
        title: "Success",
        description: "RSVP added successfully",
      });

      // Reset form and close modal
      setFormData({
        name: "",
        response: rsvp_response.yes,
        comment: "",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add RSVP",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserPlus size={16} />
          Add Manual RSVP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Manual RSVP</DialogTitle>
          <DialogDescription>Add an RSVP on behalf of someone else for this event.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Response</Label>
              <div className="col-span-3">
                <RadioGroup value={formData.response} onValueChange={handleResponseChange} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={rsvp_response.yes} id="manual-rsvp-yes" />
                    <Label htmlFor="manual-rsvp-yes" className="flex items-center gap-2 font-normal cursor-pointer">
                      <ThumbsUp className="h-4 w-4" /> Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={rsvp_response.no} id="manual-rsvp-no" />
                    <Label htmlFor="manual-rsvp-no" className="flex items-center gap-2 font-normal cursor-pointer">
                      <ThumbsDown className="h-4 w-4" /> No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={rsvp_response.maybe} id="manual-rsvp-maybe" />
                    <Label htmlFor="manual-rsvp-maybe" className="flex items-center gap-2 font-normal cursor-pointer">
                      <HelpCircle className="h-4 w-4" /> Maybe
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Comment
              </Label>
              <Textarea id="comment" name="comment" value={formData.comment} onChange={handleChange} className="col-span-3" placeholder="Optional comment" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add RSVP"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
