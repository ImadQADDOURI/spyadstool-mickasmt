// components/adsLibrary/AdsCollections/CollectionOptions.tsx

import React from 'react';
import { MoreVertical, Pencil, Trash, MoveRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Collection {
  id: string;
  name: string;
}

interface CollectionOptionsProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
  onMove: (collectionId: string) => void;
}

export function CollectionOptions({ collection, onEdit, onDelete, onMove }: CollectionOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full bg-white bg-opacity-75 hover:bg-opacity-100">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          onEdit(collection);
        }}>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          onDelete(collection.id);
        }}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          onMove(collection.id);
        }}>
          <MoveRight className="mr-2 h-4 w-4" />
          Move All Ads
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}