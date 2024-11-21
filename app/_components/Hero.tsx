"use client";

import { Button } from "@/components/ui/button";
import { useGetSocialsLinks } from "@/hooks/constants";
import { useClerk, useUser } from "@clerk/nextjs";
import { Github, Heart } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

function Hero() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { theme } = useTheme();
  const { linkedin, github } = useGetSocialsLinks();

  return (
    <div
      className={`herobg ${theme == "dark" ? "dark" : ""} -mt-16 flex h-screen flex-col items-center justify-center gap-4 px-4`}
    >
      <h1 className="text-center text-5xl font-black">
        Your Digital Cinematic Memory
      </h1>
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
            <Button onClick={() => openSignIn()}>Get Started</Button>
          </div>
        )}
      </div>
      <footer className="fixed bottom-0 hidden h-12 w-full items-center justify-around border-t text-foreground md:flex">
        <Link href={user ? "/dashboard" : "/"} className="text-lg font-medium">
          CineVault
        </Link>
        <div className="flex items-center gap-2">
          Made with <Heart className="size-5" /> by{" "}
          <span className="font-bold">
            <Link href={linkedin} target="_blank">
              Akshat Dubey
            </Link>
          </span>
        </div>
        <Link href={github} className="flex items-center gap-2" target="_blank">
          GitHub
          <Github className="size-5" />
        </Link>
      </footer>
    </div>
  );
}

export default Hero;
