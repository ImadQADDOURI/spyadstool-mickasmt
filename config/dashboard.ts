import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    /*
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
    */
    { title: "Trending", href: "/dashboard/trending" },
    { title: "Ad Library", href: "/dashboard/ad-library" },
    { title: "Saved Ads", href: "/dashboard/saved-ads" },
    { title: "Extension", href: "/dashboard/extension" },
  ],
  sidebarNav: [
    {
      title: "Panel",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};
