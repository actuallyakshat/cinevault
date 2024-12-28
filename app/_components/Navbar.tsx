"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMoreNavItems, useGetNavItems } from "@/hooks/constants";
import { SignedIn, SignedOut, useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MobileSidebar from "./MobileSidebar";
import ThemeToggler from "./ThemeToggler";

export default function Navbar() {
  const { signOut, isSignedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { openSignIn } = useClerk();

  const navItems = useGetNavItems();
  const moreNavItems = useGetMoreNavItems();

  return (
    <header>
      <nav
        className={`fixed z-[30] flex h-16 w-full items-center justify-center bg-background`}
      >
        <div className="flex h-full w-full items-center justify-between px-6 lg:container lg:px-4">
          <h1 className="hidden text-xl font-extrabold lg:block">
            <Link href={isSignedIn ? "/dashboard" : "/"}>CineVault</Link>
          </h1>
          <MobileSidebar menuItems={[...navItems, ...moreNavItems]} />
          <div className="hidden items-center space-x-2 lg:flex">
            <SignedIn>
              {navItems.map(({ href, label }) => (
                <NavLink key={href} href={href} title={label} />
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost">More</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-1">
                  {moreNavItems.map(({ href, label }) => (
                    <DropdownMenuItem
                      key={href}
                      onClick={() => router.push(href)}
                      className="cursor-pointer px-3 py-2 font-semibold"
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                  {moreNavItems.length == 0 && (
                    <DropdownMenuItem
                      disabled
                      className="cursor-pointer px-3 py-2 font-semibold"
                    >
                      Loading...
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
          </div>
          <div className="flex items-center justify-end gap-3">
            <SignedIn>
              <Button variant="ghost" onClick={() => signOut()}>
                Sign out
              </Button>
            </SignedIn>
            <SignedOut>
              <Button variant={"ghost"} asChild>
                <Link href="/sign-in">Sign in</Link>
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
