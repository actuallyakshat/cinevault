"use client";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  useAuth,
  useClerk,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import ThemeToggler from "./ThemeToggler";
const navLinks = [
  { href: "/search", label: "Search" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { signOut, isSignedIn } = useAuth();
  const pathname = usePathname();
  const { openSignIn } = useClerk();
  return (
    <nav
      className={`${pathname == "/" ? "" : "bg-background"} fixed z-[1000] flex h-16 w-full items-center justify-center`}
    >
      <div className="container flex h-full items-center justify-between">
        <h1 className="text-xl font-extrabold">
          <Link href={isSignedIn ? "/dashboard" : "/"}>CineVault</Link>
        </h1>
        <div className="flex items-center space-x-2">
          <SignedIn>
            {navLinks.map(({ href, label }) => (
              <NavLink key={href} href={href} title={label} />
            ))}
            <Button variant="ghost" onClick={() => signOut()}>
              Sign out{" "}
            </Button>
          </SignedIn>
          <SignedOut>
            <Button variant={"ghost"} onClick={() => openSignIn()}>
              Sign in
            </Button>
          </SignedOut>
        </div>
        <ThemeToggler />
      </div>
    </nav>
  );
}

function NavLink({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={pathname == href ? "bg-primary/10 hover:bg-primary/10" : ""}
      >
        {title}
      </Button>
    </Link>
  );
}
