import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import ExpandableSidebar from "@/components/layout/ExpandableSidebar";
import { DashboardNav } from "@/components/layout/nav";
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
    <div className="flex min-h-screen flex-col space-y-6">
      <NavBar user={user} items={dashboardConfig.mainNav} scroll={false} />

      <div className="container flex flex-1 flex-col gap-12 md:flex-row">
        <aside className="hidden  md:flex">
          <ExpandableSidebar items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
