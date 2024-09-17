// components/adsLibrary/AdsCollections/userCollections.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateCollectionButton } from "@/components/adsLibrary/AdsCollections/CreateCollectionButton";
import { getCollections, updateCollection, deleteCollection, moveAllAds } from "@/app/actions/collectionActions";
import { ScrollButtons } from "../ScrollButtons";
import { CollectionCard } from "./CollectionCard";

interface Collection {
  id: string;
  name: string;
  updatedAt: string;
  savedAdsCount: number;
  firstAdImageUrl?: string | null;
  lastSavedAt: string;
}

export default function UserCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editName, setEditName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [destinationCollectionId, setDestinationCollectionId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const result = await getCollections();
      if (result.success && result.collections) {
        const formattedCollections: Collection[] = result.collections.map(collection => ({
          ...collection,
          updatedAt: new Date(collection.updatedAt).toISOString(),
          lastSavedAt: new Date(collection.lastSavedAt).toISOString(),
          firstAdImageUrl: collection.savedAds[0]?.imageUrl || null
        }));
        setCollections(formattedCollections);
        setFilteredCollections(formattedCollections);
      } else {
        throw new Error(result.error || "Failed to fetch collections");
      }
    } catch (error) {
      toast({
        title: "Error fetching collections",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const filtered = collections.filter((collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCollections(filtered);
  };

  const handleEditName = async () => {
    if (!editingCollection || editName.trim() === "") return;

    try {
      const result = await updateCollection(editingCollection.id, editName);
      if (result.success) {
        const updatedCollections = collections.map(c =>
          c.id === editingCollection.id ? { ...c, name: editName } : c
        );
        setCollections(updatedCollections);
        setFilteredCollections(updatedCollections);
        toast({ title: "Collection updated", description: "The collection name has been updated successfully." });
        setIsDialogOpen(false);
      } else {
        throw new Error(result.error || "Failed to update collection");
      }
    } catch (error) {
      toast({
        title: "Error updating collection",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setEditingCollection(null);
      setEditName("");
    }
  };

  const handleDeleteCollection = async () => {
    if (!selectedCollectionId) return;

    try {
      const result = await deleteCollection(selectedCollectionId);
      if (result.success) {
        const updatedCollections = collections.filter(c => c.id !== selectedCollectionId);
        setCollections(updatedCollections);
        setFilteredCollections(updatedCollections);
        toast({ title: "Collection deleted", description: "The collection has been deleted successfully." });
      } else {
        throw new Error(result.error || "Failed to delete collection");
      }
    } catch (error) {
      toast({
        title: "Error deleting collection",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedCollectionId(null);
    }
  };

  const handleMoveAllAds = async () => {
    if (!selectedCollectionId || !destinationCollectionId) return;

    try {
      const result = await moveAllAds(selectedCollectionId, destinationCollectionId);
      if (result.success) {
        await fetchCollections(); // Refresh collections to update counts
        toast({ title: "Ads moved", description: "All ads have been moved successfully." });
      } else {
        throw new Error(result.error || "Failed to move ads");
      }
    } catch (error) {
      toast({
        title: "Error moving ads",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsMoveDialogOpen(false);
      setSelectedCollectionId(null);
      setDestinationCollectionId("");
    }
  };

  return (
    <div className="container mx-auto min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="mb-10 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
          Your Collections
        </h1>
        <CreateCollectionButton onCollectionCreated={fetchCollections} />
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
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={(collection) => {
                setEditingCollection(collection);
                setEditName(collection.name);
                setIsDialogOpen(true);
              }}
              onDelete={(collectionId) => {
                setSelectedCollectionId(collectionId);
                setIsDeleteDialogOpen(true);
              }}
              onMove={(collectionId) => {
                setSelectedCollectionId(collectionId);
                setIsMoveDialogOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-gray-600 dark:text-gray-400">
          No collections found. Create a new collection to get started!
        </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Collection</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="New collection name"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditName}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this collection? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move All Ads Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move All Ads</DialogTitle>
          </DialogHeader>
          <p>Select a destination collection to move all ads:</p>
          <select
            value={destinationCollectionId}
            onChange={(e) => setDestinationCollectionId(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">Select a collection</option>
            {collections
              .filter(c => c.id !== selectedCollectionId)
              .map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))
            }
          </select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMoveAllAds} disabled={!destinationCollectionId}>Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scroll Buttons */}
      <ScrollButtons />
    </div>
  );
}