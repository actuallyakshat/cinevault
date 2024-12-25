"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function UpdateNameDialog({
  onUpdate,
  isAuthorised,
  name,
  children,
}: {
  onUpdate: (name: string) => void;
  isAuthorised: boolean;
  name: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(name);
  const [loading, setLoading] = React.useState(false);
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
            await onUpdate(newName);
            setLoading(false);
            setIsOpen(false);
          }}
        >
          <Label>Name</Label>
          <Input
            maxLength={50}
            type="text"
            placeholder="Enter board name"
            defaultValue={name}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button type="submit" className="mt-3 w-full" disabled={loading}>
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
