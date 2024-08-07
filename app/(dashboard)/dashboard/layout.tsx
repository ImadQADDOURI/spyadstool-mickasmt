import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
// import { DashboardNav } from "@/components/layout/nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col ">
      <NavBar user={user} items={dashboardConfig.mainNav} scroll={false} />

      <div className=" flex-1   ">
        <main className="flex w-full flex-1 flex-col overflow-hidden ">
          {children}
        </main>
      </div>

      <SiteFooter className="border-t" />
    </div>
  );
}
