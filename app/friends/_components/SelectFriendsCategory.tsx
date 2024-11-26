"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectFriendCategory({
  selectedCategory,
}: {
  selectedCategory: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleValueChange = (value: string) => {
    router.push(`${pathname}?category=${value}`);
  };

  return (
    <Select defaultValue={selectedCategory} onValueChange={handleValueChange}>
      <SelectTrigger className="mt-4 w-[240px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Friends</SelectItem>
        <SelectItem value="incoming">Incoming Requests</SelectItem>
        <SelectItem value="outgoing">Outgoing Requests</SelectItem>
      </SelectContent>
    </Select>
  );
}
