"use client";
import React, { useContext, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/providers/auth-provider";
import { updateUserProfile } from "../_actions/actions";

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  showFavorites: boolean;
}
export default function EditProfileDialog() {
  const { userDetails } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<UserProfile>({
    userId: userDetails?.id || "",
    name: "",
    email: "",
    showFavorites: false,
  });
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userDetails) {
      setProfile({
        userId: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        showFavorites: userDetails.showFavoritesOnProfile,
      });
    }
  }, [userDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setProfile((prev) => ({ ...prev, showFavorites: checked }));
  };

  const isProfileChanged = useMemo(() => {
    if (!userDetails) return false;
    return (
      profile.name !== userDetails.name ||
      profile.email !== userDetails.email ||
      profile.showFavorites !== userDetails.showFavoritesOnProfile
    );
  }, [profile, userDetails]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isProfileChanged) return;
    setLoading(true);
    try {
      await updateUserProfile({
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        showFavorites: profile.showFavorites,
      });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Edit your profile details here. This information will be displayed
            on your profile page.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="mt-2 flex w-full flex-col gap-4"
        >
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="showFavorites">Show Favorites on Profile</Label>
            <div className="flex items-center gap-3">
              <Switch
                id="showFavorites"
                checked={profile.showFavorites}
                onCheckedChange={handleSwitchChange}
              />
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Favorites will be shown on your profile page
              </p>
            </div>
          </div>
          <Button type="submit" disabled={loading || !isProfileChanged}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
