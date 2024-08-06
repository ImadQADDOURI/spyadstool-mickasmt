// @/components/adsLibrary/AdsLibraryWrapper
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AdsLibrary } from "@/components/adsLibrary/AdsLibrary";

import PageAdsLibrary from "./PageAdsLibrary";

export default function AdsLibraryWrapper({
  initialPageId,
}: {
  initialPageId?: string;
}) {
  const [pageId, setPageId] = useState<string | undefined>(initialPageId);
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentPageId = searchParams.get("pageId");
    setPageId(currentPageId ?? undefined);
  }, [searchParams]);

  if (!pageId) {
    return <AdsLibrary />;
  }

  return <PageAdsLibrary />;
}
