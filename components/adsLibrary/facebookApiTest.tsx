import React, { useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchFacebookAds } from "@/app/actions/facebookApiTest";

export default function FacebookAdsComponent() {
  const [queryString, setQueryString] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetchFacebookAds({ queryString });
      setResult(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Facebook Ads Search</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
            placeholder="Enter search query"
            className="w-full"
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Loading..." : "Search"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 rounded bg-red-100 p-4 text-red-900 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-semibold">Result:</h3>
            <pre
              className={`overflow-x-auto rounded-md p-4 ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {result}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
