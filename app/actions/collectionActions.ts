// app/actions/collectionActions.ts
"use server";

import { revalidatePath } from "next/cache";

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

    revalidatePath("/collections");
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

export async function getCollections(): Promise<{
  success: boolean;
  collections?: Collection[];
  error?: string;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const collections = await prisma.collection.findMany({
      where: { userId: user.id },
      include: {
        savedAds: {
          select: {
            id: true,
            adData: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      success: true,
      collections: collections.map(transformToCollection),
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

    revalidatePath("/collections");
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

export async function deleteCollection(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const result = await prisma.collection.deleteMany({
      where: { id, userId: user.id },
    });

    if (result.count === 0) {
      throw new Error(
        "Collection not found or you don't have permission to delete it",
      );
    }

    revalidatePath("/collections");
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

export async function getCollectionById(
  id: string,
): Promise<{ success: boolean; collection?: Collection; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

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

    return { success: true, collection: transformToCollection(collection) };
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
