import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/presentation/layout/AppShell";
import { QueryProvider } from "@/presentation/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time Tracker",
  description: "Production-ready time tracker scaffold"
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
