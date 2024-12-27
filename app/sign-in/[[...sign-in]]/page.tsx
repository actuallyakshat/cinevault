import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="-mt-16 flex min-h-screen w-full flex-col items-center justify-center gap-3">
      <div className="mb-2">
        <h2 className="text-center text-3xl font-extrabold">
          Login to CineVault
        </h2>
        <p className="text-center text-sm font-medium text-muted-foreground">
          Your Perfect Movie Companion
        </p>
      </div>
      <SignIn />
    </div>
  );
}
