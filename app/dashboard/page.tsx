"use client";
import React, { useEffect } from "react";
import SelectMediaTypeButton from "./_components/SelectMediaTypeButton";
import { createUser, getAllUsers } from "./_actions/actions";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [mediaType, setMediaType] = React.useState<string>("Movies");
  useEffect(() => {
    getAllUsers().then((users) => {
      console.log("Users:", users);
    });
  }, []);

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
      <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
      </div>

      <SelectMediaTypeButton setMediaType={setMediaType} />
    </div>
  );
}
