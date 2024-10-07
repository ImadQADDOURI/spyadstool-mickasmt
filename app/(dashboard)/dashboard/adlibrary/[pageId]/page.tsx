// app/dashboard/ad-library/[pageId]/page.tsx
import { Suspense } from "react";

import PageAdBrowser from "@/components/adLibrary/PageAdBrowser";

interface PageProps {
  params: {
    pageId: string;
  };
}

export default function PageAdLibraryPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageAdBrowser pageId={params.pageId} />
    </Suspense>
  );
}
