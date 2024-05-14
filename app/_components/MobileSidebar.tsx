import React, { useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { NavLink } from "./Navbar";

export default function MobileSidebar({
  menuItems,
}: {
  menuItems: { href: string; label: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="block lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle className="text-3xl font-black">CineVault</SheetTitle>
            <SheetDescription asChild>
              <div className="flex flex-col pt-8">
                {menuItems.map(({ href, label }) => (
                  <SheetClose key={href} asChild>
                    <NavLink
                      href={href}
                      title={label}
                      onClose={() => setOpen(false)}
                    />
                  </SheetClose>
                ))}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
