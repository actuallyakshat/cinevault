import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Github } from "lucide-react";

import React from "react";
const githubLink = "https://github.com/actuallyakshat/cinevault";

export default async function Hero() {
  const user = await currentUser();
  return (
    <div className="herobg -mt-16 flex h-screen flex-col items-center justify-center gap-4">
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
            <Button className="bg-white text-black hover:bg-muted">
              <Link
                href={githubLink}
                target="_blank"
                className="flex items-center gap-2"
              >
                GitHub <Github size={20} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
