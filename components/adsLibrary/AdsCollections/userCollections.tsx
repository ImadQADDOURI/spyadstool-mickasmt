// @/components/adsLibrary/AdsCollections/userCollections.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Image, Loader2, Pencil, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CreateCollectionButton } from "@/components/adsLibrary/AdsCollections/CreateCollectionButton";
import {
  getCollections,
  updateCollection,
} from "@/app/actions/collectionActions";
import { ScrollButtons } from "../ScrollButtons";

import { formatTimeAgo } from "@/lib/formatTimeAgo";

interface Collection {
  id: string;
  name: string;
  updatedAt: string;
  savedAdsCount: number;
  firstAdImageUrl?: string;
}

function extractImageFromAd(adData: any): string | undefined {
  const snapshot = adData?.snapshot;
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

export default function UserCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );
  const [editName, setEditName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const result = await getCollections();
      if (result.success && result.collections) {
        const formattedCollections = result.collections.map((collection) => ({
          ...collection,
          updatedAt: collection.updatedAt.toISOString(),
          savedAdsCount: collection.savedAds?.length || 0,
          firstAdImageUrl:
            collection.savedAds && collection.savedAds.length > 0
              ? extractImageFromAd(collection.savedAds[0].adData)
              : undefined,
        }));
        setCollections(formattedCollections);
        setFilteredCollections(formattedCollections);
      } else {
        throw new Error(result.error || "Failed to fetch collections");
      }
    } catch (error) {
      toast({
        title: "Error fetching collections",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const filtered = collections.filter((collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCollections(filtered);
  };

  const handleNewCollectionCreated = (newCollection: Collection) => {
    setCollections((prevCollections) => [newCollection, ...prevCollections]);
    setFilteredCollections((prevFiltered) => [newCollection, ...prevFiltered]);
  };

  const handleEditName = async () => {
    if (!editingCollection || editName.trim() === "") return;

    try {
      const result = await updateCollection(editingCollection.id, editName);
      if (result.success && result.collection) {
        const updatedCollection = {
          ...editingCollection,
          name: editName,
          updatedAt: result.collection.updatedAt.toISOString(),
        };
        setCollections((prevCollections) =>
          prevCollections.map((c) =>
            c.id === editingCollection.id ? updatedCollection : c,
          ),
        );
        setFilteredCollections((prevFiltered) =>
          prevFiltered.map((c) =>
            c.id === editingCollection.id ? updatedCollection : c,
          ),
        );
        toast({
          title: "Collection updated",
          description: "The collection name has been updated successfully.",
        });
        setIsDialogOpen(false);
      } else {
        throw new Error(result.error || "Failed to update collection");
      }
    } catch (error) {
      toast({
        title: "Error updating collection",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setEditingCollection(null);
      setEditName("");
    }
  };

  return (
    <div className="container mx-auto min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="mb-10 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
          Your Collections
        </h1>
        <CreateCollectionButton
          onCollectionCreated={handleNewCollectionCreated}
        />
      </div>

      <div className="mb-8 flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-grow rounded-full border-2 border-gray-300 bg-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-700"
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : filteredCollections.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredCollections.map((collection) => (
            <Link href={`/dashboard/collections/${collection.id}`} key={collection.id}>
              <Card className="flex h-full transform cursor-pointer flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl dark:bg-gray-800">
                <CardContent className="flex h-full flex-col p-0">
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    {collection.firstAdImageUrl ? (
                      <img
                        src={collection.firstAdImageUrl}
                        alt={`First ad in ${collection.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Image className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute right-2 top-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full bg-white bg-opacity-75 transition-colors duration-200 hover:bg-opacity-100 dark:bg-gray-800"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingCollection(collection);
                          setEditName(collection.name);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="m-2 h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-grow flex-col justify-between p-6">
                    <h2 className="mb-2 line-clamp-2 text-xl font-bold text-gray-800 dark:text-gray-200">
                      {collection.name}
                    </h2>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{collection.savedAdsCount} ads</span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {formatTimeAgo(collection.updatedAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-gray-600 dark:text-gray-400">
          No collections found. Create a new collection to get started!
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              Rename Collection
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Enter a new name for your collection.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="New collection name"
            className="rounded-full border-2 border-gray-300 bg-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-700"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditName}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-opacity hover:opacity-90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

         {/* Scroll buttons */}
         <ScrollButtons />
    </div>
  );
}
