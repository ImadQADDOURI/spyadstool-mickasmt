// app/actions/saveAd.ts
"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { Ad } from "@/types/ad";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

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

export async function saveAd(adData: Ad, collectionId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId, userId: user.id },
    });

    if (!collection) {
      throw new Error("Collection not found or doesn't belong to the user");
    }

    const savedAd = await prisma.$transaction(async (prisma) => {
      const savedAd = await prisma.savedAd.create({
        data: {
          adArchiveID: adData.adArchiveID,
          collectionId: collectionId,
          adData: adData as any,
        },
      });

      await prisma.collection.update({
        where: { id: collectionId },
        data: { updatedAt: new Date() },
      });

      return savedAd;
    });

    revalidatePath(`/collections/${collectionId}`);
    return { success: true, savedAd };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "This ad is already saved in the selected collection.",
        };
      }
    }
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
    if (!user) {
      throw new Error("User not authenticated");
    }

    const result = await prisma.$transaction(async (prisma) => {
      const deletedAd = await prisma.savedAd.deleteMany({
        where: {
          adArchiveID: adArchiveID,
          collectionId: collectionId,
          collection: {
            userId: user.id,
          },
        },
      });

      if (deletedAd.count === 0) {
        throw new Error(
          "Ad not found in the specified collection or you don't have permission to unsave it",
        );
      }

      await prisma.collection.update({
        where: { id: collectionId },
        data: { updatedAt: new Date() },
      });

      return deletedAd;
    });

    revalidatePath(`/collections/${collectionId}`);
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
