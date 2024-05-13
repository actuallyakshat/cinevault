import React from "react";
import SelectMediaTypeButton from "./_components/SelectMediaTypeButton";
import SearchMedia from "./_components/SearchMedia";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
      <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
      </div>
      <SelectMediaTypeButton />
    </div>
  );
}
