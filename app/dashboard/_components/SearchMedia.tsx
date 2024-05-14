import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export default function SearchMedia({
  setSearchQuery,
}: {
  setSearchQuery: Function;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);
  return (
    <>
      <div className="w-full">
        <Input
          ref={ref}
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full font-medium placeholder:font-medium"
        />
      </div>
    </>
  );
}
