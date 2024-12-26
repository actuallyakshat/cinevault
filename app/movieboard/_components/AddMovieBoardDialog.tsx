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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext } from "@/providers/auth-provider";

import { useToast } from "@/components/ui/use-toast";
import { useContext, useState } from "react";
import { createMovieBoard } from "../_actions/actions";

export default function AddMovieBoardDialog() {
  const { userDetails } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function createBoardHandler() {
    if (!userDetails) return;
    if (!boardName) {
      toast({ title: "Error", description: "Board name is required" });
      return;
    }
    setLoading(true);
    try {
      const response = await createMovieBoard({
        name: boardName,
        description,
        creatorId: userDetails?.id,
      });

      if (response.success && response.board) {
        toast({
          title: "Board Created!",
          description:
            "Hooray! You have successfully created a new movie board",
        });
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"}>Add a new board</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new board</DialogTitle>
          <DialogDescription>
            What would you like to call your new board?
          </DialogDescription>
        </DialogHeader>

        <form
          className="mt-2 flex w-full flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            createBoardHandler();
          }}
        >
          <div className="space-y-1">
            <Label>Board name</Label>
            <Input
              placeholder="SRK Favourites"
              onChange={(e) => setBoardName(e.currentTarget.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              maxLength={100}
              className="max-h-[400px]"
              placeholder="A list of all my favourite Shah Rukh Khan movies"
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </div>
          <Button disabled={loading}>Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
