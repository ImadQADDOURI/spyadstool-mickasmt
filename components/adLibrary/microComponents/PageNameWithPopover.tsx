import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, Eye, Globe, ThumbsUp } from "lucide-react";

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
        <PopoverContent className="w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-4">
            {page_profile_picture_url && (
              <Image
                src={page_profile_picture_url}
                alt={page_name || "Page profile"}
                width={60}
                height={60}
                className="rounded-full border-2 border-gray-200 dark:border-gray-600"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {page_name}
              </h3>
              {categories && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {categories}
                </p>
              )}
              {page_like_count !== undefined && (
                <p className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {page_like_count.toLocaleString()} likes
                </p>
              )}
              {domain && (
                <p className="flex items-center text-sm text-gray-600 dark:text-gray-300">
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
                <a
                  href={`/dashboard/adlibrary/${page_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Ads
                </a>
                <a
                  href={page_profile_uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-sm font-medium text-purple-600 transition-colors duration-200 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Go to Page
                </a>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PageNameWithPopover;
