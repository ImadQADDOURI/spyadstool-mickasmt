// app/dashboard/ad-library/[pageId]/page.tsx
import { Suspense } from "react";
import PageAdsLibrary from "@/components/adsLibrary/PageAdsLibrary";

interface PageProps {
  params: {
    pageId: string;
  };
}

export default function PageAdLibraryPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageAdsLibrary pageId={params.pageId} />
    </Suspense>
  );
}