// app/actions/collectionActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { Ad } from "@/types/ad";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export interface Collection {
  id: string;
  name: string;
  updatedAt: Date; // When using these collections in your UI components, you can format the updatedAt date as needed. For example: const formattedDate = new Date(collection.updatedAt).toLocaleString();
  savedAds?: {
    id: string;
    adData: any; // You might want to type this more specifically based on your Ad type
  }[];
}

interface SaveAdResult {
  success: boolean;
  savedAd?: {
    id: string;
    adArchiveID: string;
    collectionId: string;
  };
  error?: string;
}

interface UnsaveAdResult {
  success: boolean;
  error?: string;
}

interface CheckAdSaveStatusResult {
  success: boolean;
  isSaved: boolean;
  savedCollectionIds: string[];
  error?: string;
}

// Utility function to format the date
function formatDate(date: Date): string {
  return date.toISOString();
}

// Utility function to transform Prisma result to Collection type
function transformToCollection(prismaCollection: any): Collection {
  return {
    ...prismaCollection,
    savedAds: prismaCollection.savedAds?.map((ad: any) => ({
      id: ad.id,
      adData: ad.adData,
    })),
  };
}

export async function createCollection(
  name: string,
): Promise<{ success: boolean; collection?: Collection; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        userId: user.id,
      },
      include: {
        savedAds: true,
      },
    });

    revalidatePath("/dashboard/collections");
    return { success: true, collection: transformToCollection(collection) };
  } catch (error) {
    console.error("Failed to create collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function getCollections() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const collections = await prisma.collection.findMany({
      where: { userId: user.id },
      include: {
        savedAds: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return {
      success: true,
      collections: collections.map((c) => ({
        ...c,
        savedAdsCount: c.savedAds.length,
        firstAdImageUrl: c.savedAds[0]?.imageUrl || null,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function updateCollection(
  id: string,
  name: string,
): Promise<{ success: boolean; collection?: Collection; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const updatedCollection = await prisma.collection.updateMany({
      where: { id, userId: user.id },
      data: { name },
    });

    if (updatedCollection.count === 0) {
      throw new Error(
        "Collection not found or you don't have permission to update it",
      );
    }

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        savedAds: {
          select: {
            id: true,
            adData: true,
          },
        },
      },
    });

    if (!collection) {
      throw new Error("Failed to retrieve updated collection");
    }

    revalidatePath("/dashboard/collections");
    return { success: true, collection: transformToCollection(collection) };
  } catch (error) {
    console.error("Failed to update collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteCollection(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    await prisma.collection.deleteMany({
      where: {
        id: id,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/collections");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function moveAllAds(
  sourceCollectionId: string,
  destinationCollectionId: string,
) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const result = await prisma.$transaction(async (prisma) => {
      const sourceCollection = await prisma.collection.findFirst({
        where: { id: sourceCollectionId, userId: user.id },
        include: { savedAds: true },
      });

      if (!sourceCollection) throw new Error("Source collection not found");

      const destinationCollection = await prisma.collection.findFirst({
        where: { id: destinationCollectionId, userId: user.id },
      });

      if (!destinationCollection)
        throw new Error("Destination collection not found");

      const movedAdsCount = await prisma.savedAd.updateMany({
        where: { collectionId: sourceCollectionId },
        data: { collectionId: destinationCollectionId },
      });

      await prisma.collection.update({
        where: { id: sourceCollectionId },
        data: {
          savedAdsCount: 0,
          updatedAt: new Date(),
        },
      });

      await prisma.collection.update({
        where: { id: destinationCollectionId },
        data: {
          savedAdsCount: { increment: movedAdsCount.count },
          lastSavedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return movedAdsCount.count;
    });

    revalidatePath("/dashboard/collections");
    return { success: true, movedAdsCount: result };
  } catch (error) {
    console.error("Failed to move ads:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function getCollectionById(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const collection = await prisma.collection.findFirst({
      where: { id, userId: user.id },
      include: {
        savedAds: {
          select: {
            id: true,
            adData: true,
          },
        },
      },
    });

    if (!collection) {
      throw new Error(
        "Collection not found or you don't have permission to view it",
      );
    }

    return {
      success: true,
      collection: {
        ...collection,
        updatedAt: collection.updatedAt.toISOString(),
        savedAdsCount: collection.savedAds.length,
      },
    };
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// ad actions

export async function saveAd(adData: Ad, collectionId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const savedAd = await prisma.$transaction(async (prisma) => {
      const savedAd = await prisma.savedAd.create({
        data: {
          adArchiveID: adData.adArchiveID,
          collectionId: collectionId,
          adData: adData as unknown as Prisma.InputJsonValue,
          imageUrl: extractImageFromAd(adData),
        },
      });

      await prisma.collection.update({
        where: { id: collectionId },
        data: {
          savedAdsCount: { increment: 1 },
          lastSavedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return savedAd;
    });

    revalidatePath(`/dashboard/collections/${collectionId}`);
    return { success: true, savedAd };
  } catch (error) {
    console.error("Failed to save ad:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function checkAdSaveStatus(
  adArchiveID: string,
): Promise<CheckAdSaveStatusResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const savedAds = await prisma.savedAd.findMany({
      where: {
        adArchiveID: adArchiveID,
        collection: {
          userId: user.id,
        },
      },
      select: {
        collectionId: true,
      },
    });

    const isSaved = savedAds.length > 0;
    const savedCollectionIds = savedAds.map((ad) => ad.collectionId);

    return { success: true, isSaved, savedCollectionIds };
  } catch (error) {
    console.error("Failed to check ad save status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      isSaved: false,
      savedCollectionIds: [],
    };
  }
}

export async function unsaveAd(adArchiveID: string, collectionId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    await prisma.$transaction(async (prisma) => {
      const deletedAd = await prisma.savedAd.deleteMany({
        where: {
          adArchiveID: adArchiveID,
          collectionId: collectionId,
          collection: { userId: user.id },
        },
      });

      if (deletedAd.count === 0) {
        throw new Error(
          "Ad not found in the specified collection or you don't have permission to unsave it",
        );
      }

      await prisma.collection.update({
        where: { id: collectionId },
        data: {
          savedAdsCount: { decrement: 1 },
          updatedAt: new Date(),
        },
      });
    });

    revalidatePath(`/dashboard/collections/${collectionId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to unsave ad:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// function to extract the image URL
function extractImageFromAd(adData: Ad): string | undefined {
  const snapshot = adData.snapshot;
  if (!snapshot) return undefined;

  const cards = snapshot.cards ?? [];
  const images = snapshot.images ?? [];
  const videos = snapshot.videos ?? [];

  const mediaItems = [...cards, ...images, ...videos];

  for (const item of mediaItems) {
    if (item.resized_image_url) {
      return item.resized_image_url;
    }
    if (item.video_preview_image_url) {
      return item.video_preview_image_url;
    }
  }

  return undefined;
}
