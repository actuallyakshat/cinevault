export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Profile() {
  const { userId } = await auth();

  redirect("/profile/" + userId);
  return null;
}
