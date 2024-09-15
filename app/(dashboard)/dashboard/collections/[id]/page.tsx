// app/collections/[id]/page.tsx

"use client";
import { getCollectionById } from '@/app/actions/collectionActions';
import { CollectionAdsDisplay } from '@/components/adsLibrary/AdsCollections/CollectionAdsDisplay';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const result = await getCollectionById(params.id);

  if (!result.success || !result.collection) {
    notFound();
  }

  const { collection } = result;
  const ads = collection.savedAds?.map(savedAd => savedAd.adData) || [];

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  return (
    <CollectionAdsDisplay
      collectionName={collection.name}
      collectionId={collection.id}
      ads={ads}
      adCount={ads.length}
      lastUpdated={formatDate(new Date(collection.updatedAt))}
    />
  );
}