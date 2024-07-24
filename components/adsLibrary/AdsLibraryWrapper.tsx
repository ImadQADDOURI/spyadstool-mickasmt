// @/components/adsLibrary/AdsLibraryWrapper
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AdsLibrary } from "@/components/adsLibrary/AdsLibrary";
import PageAds from "@/components/adsLibrary/PageAds";

export default function AdsLibraryWrapper({ initialPageId }: { initialPageId?: string }) {
  const [pageId, setPageId] = useState<string | undefined>(initialPageId);
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentPageId = searchParams.get("pageId");
    setPageId(currentPageId ?? undefined);
  }, [searchParams]);

  if (!pageId) {
    return <AdsLibrary />;
  }

  return <PageAds pageId={pageId} />;
}