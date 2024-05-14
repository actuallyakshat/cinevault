import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./_components/Navbar";
import NextTopLoader from "nextjs-toploader";
import { NavigationLoader, ThemeProvider } from "@/providers/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineVault",
  description: "Your Digital Cinematic Memory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NavigationLoader>
              <Navbar />
              <div className="pt-16">{children}</div>
            </NavigationLoader>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
