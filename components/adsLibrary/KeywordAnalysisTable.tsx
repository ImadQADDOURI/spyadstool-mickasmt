import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Ad } from "@/types/ad";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Keyword = {
  word: string;
  count: number;
};

const extractText = (ad: Ad): string => {
  const { snapshot } = ad;
  const texts = [
    snapshot.body?.markup?.__html,
    snapshot.title,
    ...(snapshot.cards?.map((card) => [card.body, card.title]).flat() ?? []),
  ];
  return texts.filter(Boolean).join(" ").toLowerCase();
};

const getKeywords = (text: string, minLength: number = 3): Keyword[] => {
  const words = text.match(/\b\w+\b/g) || [];
  const counts: Record<string, number> = {};
  words.forEach((word) => {
    if (word.length >= minLength) {
      counts[word] = (counts[word] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
};

const getLongTailKeywords = (text: string): Keyword[] => {
  const words = text.match(/\b\w+\b/g) || [];
  const phrases: Record<string, number> = {};

  // Consider phrases of 2 to 4 words
  for (let i = 0; i < words.length; i++) {
    for (let j = 2; j <= 4 && i + j <= words.length; j++) {
      const phrase = words.slice(i, i + j).join(" ");
      if (phrase.length >= 10) {
        // Only consider phrases of 10 characters or more
        phrases[phrase] = (phrases[phrase] || 0) + 1;
      }
    }
  }

  return Object.entries(phrases)
    .filter(([_, count]) => count > 1) // Only phrases that appear more than once
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
};

interface KeywordAnalysisTableProps {
  ad: Ad;
}

const KeywordAnalysisTable: React.FC<KeywordAnalysisTableProps> = ({ ad }) => {
  const [expanded, setExpanded] = useState(false);
  const text = React.useMemo(() => extractText(ad), [ad]);
  const topKeywords = React.useMemo(() => getKeywords(text), [text]);
  const longTailKeywords = React.useMemo(
    () => getLongTailKeywords(text),
    [text],
  );

  const displayCount = expanded
    ? Math.max(topKeywords.length, longTailKeywords.length)
    : 5;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[45%]">Top Focus Keywords</TableHead>
            <TableHead className="w-[10%]">Count</TableHead>
            <TableHead className="w-[35%]">Long-Tail Keywords</TableHead>
            <TableHead className="w-[10%]">Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: displayCount }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="max-w-[200px] truncate">
                {topKeywords[index]?.word || ""}
              </TableCell>
              <TableCell>{topKeywords[index]?.count || ""}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {longTailKeywords[index]?.word || ""}
              </TableCell>
              <TableCell>{longTailKeywords[index]?.count || ""}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {Math.max(topKeywords.length, longTailKeywords.length) > 5 && (
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="outline"
          className="w-full"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default KeywordAnalysisTable;
