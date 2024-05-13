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
const navLinks = [{ href: "/dashboard", label: "Dashboard" }];

export default function Navbar() {
  const { signOut } = useAuth();
  const pathname = usePathname();
  const { openSignIn } = useClerk();
  return (
    <nav
      className={`${pathname == "/" ? "" : ""} fixed flex h-16 w-full items-center justify-center`}
    >
      <div className="container flex items-center justify-between">
        <h1 className="text-xl font-extrabold">
          <Link href={"/"}>CineVault</Link>
        </h1>
        <div className="space-x-2">
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
