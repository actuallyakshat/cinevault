import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { searchMovie } from "../_actions/actions";
import { debounce } from "lodash";

export default function SearchMedia({
  setSearchQuery,
}: {
  setSearchQuery: Function;
}) {
  return (
    <>
      <div className="w-full">
        <Input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full font-medium placeholder:font-medium"
        />
      </div>
    </>
  );
}
