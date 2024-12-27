"use client";

import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { Clapperboard, Film, Popcorn } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="relative isolate flex h-screen w-full items-center justify-center">
      <div className="mx-auto -mt-16 w-full max-w-7xl px-6 lg:flex lg:items-center lg:justify-between lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <div className="flex">
            <Link
              href={user ? "/movieboard" : "#features"}
              className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-300 dark:ring-gray-700 dark:hover:ring-gray-600"
            >
              <span className="font-semibold">New</span>
              <span className="h-4 w-px bg-gray-900/10 dark:bg-gray-700" />
              <p className="flex items-center gap-x-1">
                Introducing Movie Boards
                <span aria-hidden="true">→</span>
              </p>
            </Link>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-5xl">
            Your Digital Cinematic Memory
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Create your personal movie library, share recommendations with
            friends, and organize your watchlist. Track what you&apos;ve
            watched, rate movies, and discover new favorites.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            {user ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="lg" onClick={() => openSignIn()}>
                Get Started
              </Button>
            )}
            <Link
              href="#features"
              className="text-sm font-semibold leading-6 text-muted-foreground"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mt-16 hidden sm:mt-24 lg:mt-0 lg:block lg:flex-shrink-0 lg:flex-grow">
          <Clapperboard className="mx-auto size-64 " />
        </div>
      </div>
    </div>
  );
}
