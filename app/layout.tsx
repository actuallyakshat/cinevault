import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./_components/Navbar";
import { NavigationLoader, ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineVault",
  description: "Your Digital Cinematic Memory",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
  },
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
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              disableTransitionOnChange
            >
              <Toaster />
              <NavigationLoader>
                <Navbar />
                <div className="pt-16">{children}</div>
              </NavigationLoader>
            </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
