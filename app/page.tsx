import db from "../db/drizzle";
import { User } from "@/db/schema";
import Hero from "./_components/Hero";
export default async function Home() {
  return (
    <section>
      <Hero />
    </section>
  );
}
