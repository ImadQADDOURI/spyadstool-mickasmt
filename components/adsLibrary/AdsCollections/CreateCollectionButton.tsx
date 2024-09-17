// components/adsLibrary/AdsCollections/CreateCollectionButton.tsx
"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { Ad } from "@/types/ad";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createCollection, saveAd } from "@/app/actions/collectionActions";

interface CreateCollectionButtonProps {
  ad?: Ad;
  onCollectionCreated?: (collection: { id: string; name: string }) => void;
}

export function CreateCollectionButton({
  ad,
  onCollectionCreated,
}: CreateCollectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Invalid collection name",
        description: "Please enter a valid collection name.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCollection(newCollectionName);
      if (result.success && result.collection) {
        toast({
          title: "Collection created",
          description: `"${newCollectionName}" has been created successfully.`,
        });

        if (ad) {
          const saveResult = await saveAd(ad, result.collection.id);
          if (saveResult.success) {
            toast({
              title: "Ad saved",
              description: `The ad has been saved to "${newCollectionName}".`,
            });
          } else {
            throw new Error(
              saveResult.error || "Failed to save ad to the new collection",
            );
          }
        }

        if (onCollectionCreated) {
          onCollectionCreated(result.collection);
        }

        setNewCollectionName("");
        setIsOpen(false);
      } else {
        throw new Error(result.error || "Failed to create collection");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="transform rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 hover:scale-105 hover:opacity-90">
          <Plus className="m-2 h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
            Create New Collection
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Enter collection name"
            className="rounded-full border-2 border-gray-300 bg-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-700"
            disabled={isLoading}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateCollection}
            disabled={isLoading}
            className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-opacity hover:opacity-90"
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
