"use client";

import React, { useState } from "react";
import Link from "next/link";

import { SidebarNavItem } from "types";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";

interface ExpandableSidebarProps {
  items: SidebarNavItem[];
}

const ExpandableSidebar: React.FC<ExpandableSidebarProps> = ({ items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <div
      className={`flex h-full flex-col ${isExpanded ? "w-56" : "w-16"} transition-width duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav className="flex flex-1 flex-col overflow-y-auto">
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          return (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href || "/"}
              className={cn(
                "flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isExpanded
                  ? "bg-transparent hover:bg-accent hover:text-accent-foreground"
                  : "justify-center",
                item.disabled && "cursor-not-allowed opacity-80",
              )}
            >
              <Icon className={`${isExpanded ? "mr-2 size-4" : "size-5"}`} />
              {isExpanded && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ExpandableSidebar;
