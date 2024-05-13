"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import React from "react";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
const githubLink = "https://github.com/actuallyakshat/cinevault";

export default function Hero() {
  const { user } = useUser();
  const { theme } = useTheme();
  return (
    <section
      className={`herobg ${theme == "dark" ? "dark" : ""} -mt-16 flex h-screen flex-col items-center justify-center gap-4`}
    >
      <h1 className="text-5xl font-black">Your Digital Cinematic Memory</h1>
      <p className="w-full max-w-xl text-center text-xl font-medium text-muted-foreground">
        Your digital library of movies, TV shows, and more so that you can
        easily save recomendations, your favorite movies, and more.
      </p>
      <div>
        {user ? (
          <Button>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button>Get Started</Button>
          </div>
        )}
      </div>
    </section>
  );
}
