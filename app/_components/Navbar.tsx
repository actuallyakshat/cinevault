"use client";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileSidebar from "./MobileSidebar";
import ThemeToggler from "./ThemeToggler";
import { useGetNavItems } from "@/hooks/constants";

export default function Navbar() {
  const { signOut, isSignedIn } = useAuth();
  const pathname = usePathname();
  const { openSignIn } = useClerk();

  const navItems = useGetNavItems();

  return (
    <header>
      <nav
        className={`${pathname == "/" ? "" : "bg-background"} fixed z-[30] flex h-16 w-full items-center justify-center`}
      >
        <div className="flex h-full w-full items-center justify-between px-8 lg:container lg:px-4">
          <h1 className="hidden text-xl font-extrabold lg:block">
            <Link href={isSignedIn ? "/dashboard" : "/"}>CineVault</Link>
          </h1>
          <MobileSidebar menuItems={navItems} />
          <div className="hidden items-center space-x-2 lg:flex">
            <SignedIn>
              {navItems.map(({ href, label }) => (
                <NavLink key={href} href={href} title={label} />
              ))}
            </SignedIn>
          </div>
          <div className="flex items-center justify-end gap-3">
            <SignedIn>
              <Button variant="ghost" onClick={() => signOut()}>
                Sign out
              </Button>
            </SignedIn>
            <SignedOut>
              <Button variant={"ghost"} onClick={() => openSignIn()}>
                Sign in
              </Button>
            </SignedOut>
            <ThemeToggler />
          </div>
        </div>
      </nav>
    </header>
  );
}

export function NavLink({
  href,
  title,
  onClose,
}: {
  href: string;
  title: string;
  onClose?: Function;
}) {
  const pathname = usePathname();
  return (
    <Link href={href}>
      <Button
        onClick={onClose && (() => onClose())}
        variant="navigation"
        className={`${pathname == href ? "bg-primary/10 hover:bg-primary/10" : ""} w-full lg:w-fit `}
      >
        {title}
      </Button>
    </Link>
  );
}
