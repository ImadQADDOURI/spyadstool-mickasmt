// /app/dashboard/adlibrary/page.tsx
import { Suspense } from "react";

import { AdBrowser } from "@/components/adLibrary/AdBrowser";

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
      <AdBrowser />
    </Suspense>
  );
}
