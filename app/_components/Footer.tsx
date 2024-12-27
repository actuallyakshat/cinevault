"use client";

import { Button } from "@/components/ui/button";
import { useGetSocialsLinks } from "@/hooks/constants";
import { Github, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const { linkedin, github } = useGetSocialsLinks();

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={github}
              className="flex items-center gap-2"
              target="_blank"
            >
              <Github className="size-5" />
              GitHub
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={linkedin} target="_blank">
              LinkedIn
            </Link>
          </Button>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-muted-foreground">
            Made with <Heart className="inline size-4" /> by{" "}
            <Link
              href={linkedin}
              target="_blank"
              className="font-semibold hover:underline"
            >
              Akshat Dubey
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
