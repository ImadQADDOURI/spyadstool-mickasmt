import React from "react";
import Image from "next/image";
import {
  Calendar,
  DollarSign,
  GlobeIcon,
  Info,
  Instagram,
  MapPin,
  Target,
  ThumbsUp,
  Users,
} from "lucide-react";

import { countryCodesAlpha2Flag } from "@/lib/countryCodesAlpha2Flag";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PageInfoSectionProps {
  page: any;
  pageInfo: any;
  profilePictureUrl: string | null;
  totalAds: number;
}

export const PageInfoSection: React.FC<PageInfoSectionProps> = ({
  page,
  pageInfo,
  profilePictureUrl,
  totalAds,
}) => {
  const creationDate = page.pages_transparency_info?.history_items.find(
    (item) => item.item_type === "CREATION",
  )?.event_time;
  const adminLocations =
    page.pages_transparency_info?.admin_locations?.admin_country_counts || [];

  const MetricItem = ({
    icon: Icon,
    value,
    tooltip,
    badge,
  }: {
    icon: any;
    value: string;
    tooltip: string;
    badge?: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center space-x-2 rounded-full bg-white bg-opacity-20 px-3 py-1">
          <Icon className="h-5 w-5 text-white" />
          <span className="font-semibold text-white">{value}</span>
          {badge && <Image src={badge} alt="Verified" width={24} height={24} />}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 p-4">
      <div className="rounded-lg bg-white bg-opacity-10 p-4 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Left Section: Profile Info and About */}
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <Image
                src={profilePictureUrl || "/icons/user.png"}
                alt={pageInfo.page_name || page.name}
                width={80}
                height={80}
                className="rounded-full border-2 border-white"
              />
              <div>
                <div className="flex items-center">
                  <h1 className="mr-2 text-2xl font-bold text-white">
                    {pageInfo.page_name || page.name}
                  </h1>
                  {pageInfo.page_verification !== "NOT_VERIFIED" && (
                    <Image
                      src="/icons/verified-badge.png"
                      alt="Facebook Verified"
                      width={20}
                      height={20}
                    />
                  )}
                </div>
                <div className="mb-2 text-sm text-white">
                  <span>{pageInfo.page_category || "Uncategorized"}</span>
                </div>
                {page.about?.text && (
                  <p className="max-w-md text-sm text-white opacity-80">
                    {page.about.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Metrics and Visit Button */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <MetricItem
              icon={ThumbsUp}
              value={pageInfo.likes?.toLocaleString() || "0"}
              tooltip="Facebook Likes"
            />
            {pageInfo.ig_username && (
              <MetricItem
                icon={Instagram}
                value={pageInfo.ig_followers?.toLocaleString() || "0"}
                tooltip="Instagram Followers"
                badge={
                  pageInfo.ig_verification
                    ? "/icons/verified-badge.png"
                    : undefined
                }
              />
            )}
            <MetricItem
              icon={Target}
              value={totalAds.toString()}
              tooltip="Total Ads"
            />
            <MetricItem
              icon={DollarSign}
              value={
                page.ad_library_page_targeting_insight
                  ?.ad_library_page_targeting_summary?.total_spend_formatted ===
                "0"
                  ? "Unknown"
                  : page.ad_library_page_targeting_insight
                      ?.ad_library_page_targeting_summary
                      ?.total_spend_formatted || "Unknown"
              }
              tooltip="Total Ad Spend"
            />
            {creationDate && (
              <MetricItem
                icon={Calendar}
                value={new Date(creationDate * 1000).toLocaleDateString()}
                tooltip="Page Creation Date"
              />
            )}
            {adminLocations.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center space-x-2 rounded-full bg-white bg-opacity-20 px-3 py-1">
                    <MapPin className="h-5 w-5 text-white" />
                    <div className="flex">
                      {adminLocations.slice(0, 3).map((location, index) => {
                        const countryInfo = countryCodesAlpha2Flag.find(
                          (c) => c.label === location.country.iso_name,
                        );
                        return countryInfo ? (
                          <Image
                            key={index}
                            src={countryInfo.icon}
                            alt={countryInfo.label}
                            width={24}
                            height={24}
                            className="ml-1 rounded-sm first:ml-0"
                          />
                        ) : null;
                      })}
                    </div>
                    {adminLocations.length > 3 && (
                      <span className="text-xs text-white">
                        +{adminLocations.length - 3}
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="mb-1 font-semibold">Admin Locations:</p>
                    {adminLocations.map((location, index) => (
                      <p key={index}>
                        {location.country.iso_name}: {location.count}
                      </p>
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <a
            href={pageInfo.page_profile_uri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-white bg-opacity-20 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            <GlobeIcon className="mr-1 inline-block h-4 w-4" />
            Visit Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default PageInfoSection;
