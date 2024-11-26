"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/providers/auth-provider";
import { FormEvent, useContext, useState } from "react";
import { addFriend } from "../_actions/actions";

export default function AddFriendsModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(AuthContext);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email) {
        toast({
          title: "Error",
          description: "Please enter an email address.",
        });
        return;
      }
      setLoading(true);
      const response = await addFriend(userDetails?.id!, email);

      if (response?.success) {
        setOpen(false);
        toast({ title: "Success", description: "Friend request sent." });
      } else {
        toast({ title: "Error", description: response?.message });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: error as string });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"}>Add Friends</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to add as a friend.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Input
            placeholder="Enter email address"
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
