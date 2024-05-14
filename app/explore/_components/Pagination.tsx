import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PaginationComponent({
  pageNumber,
  setPageNumber,
}: {
  pageNumber: number;
  setPageNumber: Function;
}) {
  return (
    <div className="inline-flex justify-center gap-1 font-medium">
      <div
        onClick={() => setPageNumber(pageNumber - 1)}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded border bg-background"
      >
        <ChevronLeft />
      </div>

      <div className="flex h-full items-center justify-center rounded border px-4">
        {pageNumber}
      </div>

      <div
        onClick={() => setPageNumber(pageNumber + 1)}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded border "
      >
        <ChevronRight />
      </div>
    </div>
  );
}
