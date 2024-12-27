"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Nehal Aggarwal",
    role: "Movie Enthusiast",
    content:
      "CineVault has completely changed how I track and share movies. The movie boards feature is brilliant!",
    avatar: "NA",
  },
  {
    name: "Dhruv Kaushik",
    role: "Movie Enthusiast",
    content:
      "Perfect for keeping track of my watchlist and sharing recommendations with classmates.",
    avatar: "DK",
  },
  {
    name: "Atishya Pradhan",
    role: "Movie Enthusiast",
    content:
      "The best platform I've found for organizing my movie collections and writing reviews.",
    avatar: "AP",
  },
];

export function Testimonials() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            Loved by Movie Enthusiasts
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-x-4">
                  <Avatar>
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
