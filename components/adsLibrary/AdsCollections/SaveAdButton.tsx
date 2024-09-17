// components/SaveAdButton.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ChevronDown, Heart, Plus, Search, X } from "lucide-react";

import { Ad } from "@/types/ad";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CreateCollectionButton } from "@/components/adsLibrary/AdsCollections/CreateCollectionButton";
import { getCollections, checkAdSaveStatus, saveAd, unsaveAd } from "@/app/actions/collectionActions";

interface SaveAdButtonProps {
  ad: Ad;
}

interface CollectionWithSaveStatus {
  id: string;
  name: string;
  isSaved: boolean;
}

const COLLECTIONS_PER_PAGE = 10;

export function SaveAdButton({ ad }: SaveAdButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionWithSaveStatus[]>(
    [],
  );
  const [filteredCollections, setFilteredCollections] = useState<
    CollectionWithSaveStatus[]
  >([]);
  const [displayedCollections, setDisplayedCollections] = useState<
    CollectionWithSaveStatus[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdSaved, setIsAdSaved] = useState(false);
  const [unsaveConfirmation, setUnsaveConfirmation] = useState<{
    isOpen: boolean;
    collectionId: string | null;
  }>({ isOpen: false, collectionId: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      await fetchCollectionsAndSaveStatus();
    } else {
      setSearchTerm("");
      setPage(1);
    }
    setIsOpen(open);
  };

  const fetchCollectionsAndSaveStatus = async () => {
    setIsLoading(true);
    try {
      const [collectionsResult, saveStatusResult] = await Promise.all([
        getCollections(),
        checkAdSaveStatus(ad.adArchiveID),
      ]);

      if (
        collectionsResult.success &&
        Array.isArray(collectionsResult.collections)
      ) {
        const collectionsWithSaveStatus: CollectionWithSaveStatus[] =
          collectionsResult.collections.map((collection) => ({
            ...collection,
            isSaved:
              Array.isArray(saveStatusResult.savedCollectionIds) &&
              saveStatusResult.savedCollectionIds.includes(collection.id),
          }));
        setCollections(collectionsWithSaveStatus);
        setFilteredCollections(collectionsWithSaveStatus);
        setDisplayedCollections(
          collectionsWithSaveStatus.slice(0, COLLECTIONS_PER_PAGE),
        );
      } else {
        throw new Error(
          collectionsResult.error || "Failed to fetch collections",
        );
      }

      setIsAdSaved(saveStatusResult.isSaved === true);
    } catch (error) {
      toast({
        title: "Error fetching data",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAd = async (collectionId: string) => {
    setIsLoading(true);
    try {
      const result = await saveAd(ad, collectionId);
      if (result.success) {
        toast({
          title: "Ad saved successfully",
          description: `The ad has been saved to your collection.`,
        });
        updateCollectionSaveStatus(collectionId, true);
        setIsAdSaved(true);
      } else {
        throw new Error(result.error || "Failed to save ad");
      }
    } catch (error) {
      toast({
        title: "Error saving ad",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsaveAd = async (collectionId: string) => {
    setIsLoading(true);
    try {
      const result = await unsaveAd(ad.adArchiveID, collectionId);
      if (result.success) {
        toast({
          title: "Ad unsaved successfully",
          description: `The ad has been removed from your collection.`,
        });
        updateCollectionSaveStatus(collectionId, false);
      } else {
        throw new Error(result.error || "Failed to unsave ad");
      }
    } catch (error) {
      toast({
        title: "Error unsaving ad",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUnsaveConfirmation({ isOpen: false, collectionId: null });
    }
  };

  const updateCollectionSaveStatus = (
    collectionId: string,
    isSaved: boolean,
  ) => {
    const updatedCollections = collections.map((c) =>
      c.id === collectionId ? { ...c, isSaved } : c,
    );
    setCollections(updatedCollections);
    setFilteredCollections(
      updatedCollections.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    setIsAdSaved(updatedCollections.some((c) => c.isSaved));
  };

  const handleNewCollectionCreated = (newCollection: {
    id: string;
    name: string;
  }) => {
    const updatedCollections = [
      { ...newCollection, isSaved: true },
      ...collections,
    ];
    setCollections(updatedCollections);
    setFilteredCollections(updatedCollections);
    setDisplayedCollections(updatedCollections.slice(0, COLLECTIONS_PER_PAGE));
    setIsAdSaved(true);
  };

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);
      const filtered = collections.filter((collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCollections(filtered);
      setDisplayedCollections(filtered.slice(0, COLLECTIONS_PER_PAGE));
      setPage(1);
    },
    [collections],
  );

  const loadMoreCollections = () => {
    const nextPage = page + 1;
    const nextCollections = filteredCollections.slice(
      0,
      nextPage * COLLECTIONS_PER_PAGE,
    );
    setDisplayedCollections(nextCollections);
    setPage(nextPage);
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors duration-200"
          >
            <Heart
              className={`h-4 w-4 ${isAdSaved ? "fill-current text-pink-500" : "text-gray-600 dark:text-gray-300"}`}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Manage Ad in Collections
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Search className="h-6 w-6 ml-2 text-gray-400" />
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-grow bg-transparent border-2 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 rounded-full"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearch("")}
                  className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <CreateCollectionButton
                ad={ad}
                onCollectionCreated={handleNewCollectionCreated}
              />
            </div>
            <div className="max-h-[300px] space-y-2 overflow-y-auto">
              {displayedCollections.map((collection) => (
                <Button
                  key={collection.id}
                  onClick={() =>
                    collection.isSaved
                      ? setUnsaveConfirmation({
                          isOpen: true,
                          collectionId: collection.id,
                        })
                      : handleSaveAd(collection.id)
                  }
                  className="w-full justify-between rounded-full"
                  disabled={isLoading}
                  variant={collection.isSaved ? "destructive" : "default"}
                >
                  {collection.name}
                  {collection.isSaved ? (
                    <X className="ml-2 h-4 w-4" />
                  ) : (
                    <Plus className="ml-2 h-4 w-4" />
                  )}
                </Button>
              ))}
              {filteredCollections.length > displayedCollections.length && (
                <Button
                  onClick={loadMoreCollections}
                  variant="outline"
                  className="w-full rounded-full"
                >
                  Load More <ChevronDown className="ml-2 h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
  
      <AlertDialog
        open={unsaveConfirmation.isOpen}
        onOpenChange={(isOpen) =>
          setUnsaveConfirmation({ ...unsaveConfirmation, isOpen })
        }
      >
        <AlertDialogContent className="bg-white dark:bg-gray-800 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Confirm Unsave
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to unsave this ad from the collection? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-opacity"
              onClick={() =>
                unsaveConfirmation.collectionId &&
                handleUnsaveAd(unsaveConfirmation.collectionId)
              }
            >
              Confirm Unsave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
