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
import { useToast } from "@/components/ui/use-toast";
import React from "react";

export default function UpdateNameDialog({
  onUpdate,
  isAuthorised,
  name,
  oldDescription,
  children,
}: {
  onUpdate: (name: string, description: string) => Promise<void>;
  isAuthorised: boolean;
  name: string;
  oldDescription: string | null;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(name);
  const [loading, setLoading] = React.useState(false);
  const [description, setDescription] = React.useState(oldDescription || "");
  const { toast } = useToast();

  if (!isAuthorised) return children;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newName || newName.trim().length == 0) {
              toast({
                title: "Name cannot be empty",
                description: "Please enter a name for the board",
              });
              return;
            }

            setLoading(true);
            await onUpdate(newName, description);
            setLoading(false);
            setIsOpen(false);
          }}
          className="flex flex-col gap-3"
        >
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              maxLength={50}
              type="text"
              placeholder="Enter board name"
              defaultValue={name}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="pt-3">Description</Label>
            <Textarea
              placeholder="Some description about the board"
              defaultValue={description}
              maxLength={1000}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="mt-3 w-full" disabled={loading}>
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
