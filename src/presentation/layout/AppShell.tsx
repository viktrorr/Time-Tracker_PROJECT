import { TopNavigation } from "@/presentation/layout/TopNavigation";
import type { ReactNode } from "react";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

export function AppShell({ children }: AppShellProps): JSX.Element {
  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
