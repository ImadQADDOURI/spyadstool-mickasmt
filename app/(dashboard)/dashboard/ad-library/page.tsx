// /app/dashboard/ad-library/page.tsx
import { Suspense } from "react";

import AdsLibraryWrapper from "@/components/adsLibrary/AdsLibraryWrapper";

interface SearchParams {
  pageId?: string;
}

export default function AdLibraryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const pageId = searchParams?.pageId;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdsLibraryWrapper initialPageId={pageId} />
    </Suspense>
  );
}
