// /app/dashboard/ad-library/page.tsx
import { Suspense } from "react";

import AdsLibrary from "@/components/adsLibrary/AdsLibrary";

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
      <AdsLibrary />
    </Suspense>
  );
}
