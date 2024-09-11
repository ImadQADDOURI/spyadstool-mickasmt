import React, { useState } from "react";

import { Ad } from "@/types/ad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAdCreative } from "@/app/actions/geminiAi";

interface AdCreative {
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
}

const AdCreativeGenerator: React.FC<{ ad: Ad }> = ({ ad }) => {
  const [adCreative, setAdCreative] = useState<AdCreative | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCreative = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const creative = await generateAdCreative(ad);
      setAdCreative(creative);
    } catch (err) {
      setError("Failed to generate ad copy. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerateCreative} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Ad Creative Copy"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}

      {adCreative && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Ad Creative Copy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <h4 className="font-semibold">Primary Text:</h4>
              <p>{adCreative.primaryText}</p>
            </div>
            <div>
              <h4 className="font-semibold">Headline:</h4>
              <p>{adCreative.headline}</p>
            </div>
            <div>
              <h4 className="font-semibold">Description:</h4>
              <p>{adCreative.description}</p>
            </div>
            <div>
              <h4 className="font-semibold">Call to Action:</h4>
              <p>{adCreative.callToAction}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdCreativeGenerator;
