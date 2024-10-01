"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";

import { apiNameToDocId } from "@/lib/metaGraphQLConstants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { metaGraphQLApi } from "@/app/actions/Meta-GraphQL-Api";

export default function MetaGraphQLTester() {
  const [variables, setVariables] = useState<string>("{}");
  const [apiName, setApiName] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const parsedVariables = JSON.parse(variables);
      const response = await metaGraphQLApi({
        variables: parsedVariables,
        fb_api_req_friendly_name: apiName,
      });
      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultItem = (item: any, depth = 0) => {
    if (typeof item !== "object" || item === null) {
      return <span>{JSON.stringify(item)}</span>;
    }

    return (
      <div style={{ marginLeft: `${depth * 20}px` }}>
        {Object.entries(item).map(([key, value]) => (
          <div key={key}>
            <span className="font-semibold">{key}: </span>
            {typeof value === "object" && value !== null ? (
              renderResultItem(value, depth + 1)
            ) : (
              <span>{JSON.stringify(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Meta GraphQL API Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="variables">Variables (JSON format)</Label>
            <textarea
              id="variables"
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              className="h-32 w-full rounded border p-2"
              placeholder='{"key": "value"}'
            />
          </div>
          <div>
            <Label htmlFor="apiName">API Name</Label>
            <Select onValueChange={setApiName} value={apiName}>
              <SelectTrigger id="apiName">
                <SelectValue placeholder="Select API Name" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(apiNameToDocId).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Send Request"}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-semibold">Result:</h3>
            <div
              className={`overflow-x-auto rounded-md p-4 ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {Array.isArray(result)
                ? result.map((item, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold">Result {index + 1}:</h4>
                      {renderResultItem(item)}
                    </div>
                  ))
                : renderResultItem(result)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
