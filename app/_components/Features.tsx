"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Heart, ListChecks, Search, Share2, Users } from "lucide-react";

const features = [
  {
    name: "Track Movies & Shows",
    description:
      "Keep a record of everything you watch with personal ratings and reviews.",
    icon: Film,
  },
  {
    name: "Movie Boards",
    description:
      "Create themed collections and collaborate with friends on curated movie lists.",
    icon: ListChecks,
  },
  {
    name: "Share Recommendations",
    description: "Recommend movies to friends and discover their favorites.",
    icon: Share2,
  },
  {
    name: "Social Features",
    description: "Connect with friends and see what they're watching.",
    icon: Users,
  },
  {
    name: "Watchlist",
    description: "Save movies and shows you want to watch for later.",
    icon: Heart,
  },
  {
    name: "Discover",
    description: "Discover new movies and shows you've never seen before.",
    icon: Search,
  },
];

export function Features() {
  return (
    <div className="py-10" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Your Complete Movie Companion
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            CineVault helps you organize your movie life with powerful features
            designed for movie enthusiasts.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.name}
                className="transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="flex flex-row items-center justify-start gap-4 text-xl md:text-2xl">
                    <feature.icon className="size-6 text-primary" />
                    {feature.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
