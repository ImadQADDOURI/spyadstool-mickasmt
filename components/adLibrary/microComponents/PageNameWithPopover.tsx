// components\adsLibrary\PageNameWithPopover.tsx

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe, ThumbsUp } from "lucide-react";

import { Ad } from "@/types/ad";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PageNameWithPopoverProps {
  snapshot: any;
}

const PageNameWithPopover: React.FC<PageNameWithPopoverProps> = ({
  snapshot,
}) => {
  const {
    page_name,
    page_categories,
    page_like_count,
    link_url,
    page_profile_uri,
    page_profile_picture_url,
    page_id,
  } = snapshot;

  const categories = page_categories
    ? Object.values(page_categories).join(", ")
    : "";
  const domain = link_url ? new URL(link_url).hostname : "";

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Popover open={isOpen}>
        <PopoverTrigger asChild>
          <span className="cursor-pointer font-bold hover:underline">
            {page_name || "Unknown Page"}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-80" sideOffset={5}>
          <div className="flex items-center space-x-4">
            {page_profile_picture_url && (
              <Image
                src={page_profile_picture_url}
                alt={page_name || "Page profile"}
                width={60}
                height={60}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="text-lg font-bold">{page_name}</h3>
              {categories && (
                <p className="text-sm text-gray-500">{categories}</p>
              )}
              {page_like_count !== undefined && (
                <p className="flex items-center text-sm">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {page_like_count.toLocaleString()} likes
                </p>
              )}
              {domain && (
                <p className="flex items-center text-sm">
                  <Globe className="mr-1 h-4 w-4" />
                  <a
                    href={link_url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {domain}
                  </a>
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            {page_profile_uri && (
              <>
                <Link href={`/dashboard/adlibrary/${page_id}`}>
                  <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800">
                    <span className="relative rounded-md bg-white px-5 py-1 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                      View Ads
                    </span>
                  </button>
                </Link>
                <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800">
                  <span className="relative rounded-md bg-white px-5 py-1 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                    <a
                      href={page_profile_uri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Go to Page
                    </a>
                  </span>
                </button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PageNameWithPopover;
