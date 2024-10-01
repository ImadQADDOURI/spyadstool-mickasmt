"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchFacebookAds } from "@/app/actions/facebookApiTest";

const defaultHeaders = {
  accept: "*/*",
  "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
  "content-type": "application/x-www-form-urlencoded",
  cookie:
    "datr=OcriZmtZzOtqJKEUX9Zhukco; sb=upzuZjh-bKjXqMoe0VbegPf7; fr=0Q1eXeTtiLUaz52p0..Bm7py6..AAA.0.0.Bm7py6.AWVzM2Hv3fc; wd=672x935",
  origin: "https://www.facebook.com",
  referer:
    "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=MA&media_type=all&q=cat&search_type=keyword_unordered&source=nav-header",
  "sec-ch-prefers-color-scheme": "light",
  "sec-ch-ua":
    '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
  "sec-ch-ua-full-version-list":
    '"Chromium";v="128.0.6613.139", "Not;A=Brand";v="24.0.0.0", "Google Chrome";v="128.0.6613.139"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": '""',
  "sec-ch-ua-platform": '"Windows"',
  "sec-ch-ua-platform-version": '"15.0.0"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "x-asbd-id": "129477",
  "x-fb-friendly-name": "AdLibrarySearchPaginationQuery",
  "x-fb-lsd": "AVqy31NLRXs",
};

const defaultParams = {
  av: "0",
  __aaid: "0",
  __user: "0",
  __a: "1",
  __req: "2r",
  __hs: "19987.HYP:comet_plat_default_pkg.2.1..0.0",
  dpr: "1",
  __ccg: "EXCELLENT",
  __rev: "1016694340",
  __s: "4oz6iz:acglpu:lj4r7d",
  __hsi: "7417037990527946704",
  __dyn:
    "7xeUmxa13yoS1syUbFp432m2q1Dxu13wqovzEdF8ixy360CEbo9E3-xS6Ehw2nVEK12wvk0gq78b87C2m3K2y11wBz81s8hwGwQwoEcE7O2l0Fwqo31wp8kwyx2cwAxq1izXwrUcUjwGzE2VKUbo5G4EG1MUlwhE2Lxiaw5rwSyES0gq0K-1Lwqp8aE2cwmo6O1Fw5VwtU5K",
  __csr:
    "gFk_aRINflzkF4lGJybXDi59GVazpAmvykiBhEiyCqEiWwWxiq6oaoky5y8a829wkohxmiaG0B8G1ewtA0z8GEK0Jo6Wdwqoao7Si0dcw0gLC0sK02OnzEgw04fYg07dZ00p39Qaw2DE1EUG0a0w5sw",
  __comet_req: "1",
  lsd: "AVqy31NLRXs",
  jazoest: "2924",
  __spin_r: "1016694340",
  __spin_b: "trunk",
  __spin_t: "1726913729",
  __jssesw: "1",
  fb_api_caller_class: "RelayModern",
  fb_api_req_friendly_name: "AdLibrarySearchPaginationQuery",
  variables:
    '{"activeStatus":"ACTIVE","adType":"ALL","bylines":[],"collationToken":null,"contentLanguages":[],"countries":["MA"],"cursor":"AQHR9Q-WwM5vA2vQlGHYyyots5r_VQ7VUzwkeciraERoxNE2N0v7ZbQlE7c6_xX8C9Dd","excludedIDs":[],"first":30,"location":null,"mediaType":"ALL","pageIDs":[],"potentialReachInput":[],"publisherPlatforms":[],"queryString":"cat","regions":[],"searchType":"KEYWORD_UNORDERED","sessionID":"3f156780-a547-4e64-8bcb-69402d0ce274","sortData":null,"source":"NAV_HEADER","startDate":null,"v":"7218b1","viewAllPageID":"0"}',
  server_timestamps: "true",
  doc_id: "8022477101123416",
};

const defaultVariables = {
  activeStatus: "ACTIVE",
  adType: "ALL",
  bylines: [],
  collationToken: null,
  contentLanguages: [],
  countries: ["MA"],
  cursor:
    "AQHR9Q-WwM5vA2vQlGHYyyots5r_VQ7VUzwkeciraERoxNE2N0v7ZbQlE7c6_xX8C9Dd",
  excludedIDs: [],
  first: 30,
  location: null,
  mediaType: "ALL",
  pageIDs: [],
  potentialReachInput: [],
  publisherPlatforms: [],
  queryString: "cat",
  regions: [],
  searchType: "KEYWORD_UNORDERED",
  sessionID: "3f156780-a547-4e64-8bcb-69402d0ce274",
  sortData: null,
  source: "NAV_HEADER",
  startDate: null,
  v: "7218b1",
  viewAllPageID: "0",
};

type ConfigItem = {
  value: string;
  enabled: boolean;
};

type VariableItem = {
  key: string;
  value: any;
  enabled: boolean;
};

export default function EnhancedFlexibleFacebookAdsComponent() {
  const [headers, setHeaders] = useState<Record<string, ConfigItem>>(
    Object.entries(defaultHeaders).reduce(
      (acc, [key, value]) => {
        acc[key] = { value, enabled: true };
        return acc;
      },
      {} as Record<string, ConfigItem>,
    ),
  );

  const [params, setParams] = useState<Record<string, ConfigItem>>(
    Object.entries(defaultParams).reduce(
      (acc, [key, value]) => {
        if (key !== "variables") {
          acc[key] = { value: String(value), enabled: true };
        }
        return acc;
      },
      {} as Record<string, ConfigItem>,
    ),
  );

  const [variables, setVariables] = useState<VariableItem[]>(
    Object.entries(defaultVariables).map(([key, value]) => ({
      key,
      value: JSON.stringify(value),
      enabled: true,
    })),
  );

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    const activeHeaders = Object.entries(headers)
      .filter(([_, config]) => config.enabled)
      .reduce(
        (acc, [key, config]) => {
          acc[key] = config.value;
          return acc;
        },
        {} as Record<string, string>,
      );

    const activeParams = Object.entries(params)
      .filter(([_, config]) => config.enabled)
      .reduce(
        (acc, [key, config]) => {
          acc[key] = config.value;
          return acc;
        },
        {} as Record<string, string>,
      );

    const activeVariables = variables
      .filter((item) => item.enabled)
      .reduce(
        (acc, item) => {
          try {
            acc[item.key] = JSON.parse(item.value);
          } catch (e) {
            acc[item.key] = item.value;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

    activeParams.variables = JSON.stringify(activeVariables);

    try {
      const response = await fetchFacebookAds({
        headers: activeHeaders,
        params: activeParams,
      });
      setResult(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderConfigItems = (
    items: Record<string, ConfigItem>,
    setItems: React.Dispatch<React.SetStateAction<Record<string, ConfigItem>>>,
  ) => {
    return Object.entries(items).map(([key, config]) => (
      <div key={key} className="mb-2 flex items-center space-x-2">
        <Checkbox
          checked={config.enabled}
          onCheckedChange={(checked) =>
            setItems((prev) => ({
              ...prev,
              [key]: { ...prev[key], enabled: checked as boolean },
            }))
          }
        />
        <Input value={key} readOnly className="w-1/3" />
        <Input
          value={config.value}
          onChange={(e) =>
            setItems((prev) => ({
              ...prev,
              [key]: { ...prev[key], value: e.target.value },
            }))
          }
          className="w-2/3"
        />
      </div>
    ));
  };

  const addVariable = () => {
    setVariables((prev) => [...prev, { key: "", value: "", enabled: true }]);
  };

  const removeVariable = (index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariable = (
    index: number,
    field: keyof VariableItem,
    value: any,
  ) => {
    setVariables((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const resetToDefaults = () => {
    setHeaders(
      Object.entries(defaultHeaders).reduce(
        (acc, [key, value]) => {
          acc[key] = { value, enabled: true };
          return acc;
        },
        {} as Record<string, ConfigItem>,
      ),
    );

    setParams(
      Object.entries(defaultParams).reduce(
        (acc, [key, value]) => {
          if (key !== "variables") {
            acc[key] = { value: String(value), enabled: true };
          }
          return acc;
        },
        {} as Record<string, ConfigItem>,
      ),
    );

    setVariables(
      Object.entries(defaultVariables).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        enabled: true,
      })),
    );
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Enhanced Flexible Facebook Ads Search</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="headers">
            <TabsList>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="params">Parameters</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>
            <TabsContent value="headers" className="mt-4">
              {renderConfigItems(headers, setHeaders)}
            </TabsContent>
            <TabsContent value="params" className="mt-4">
              {renderConfigItems(params, setParams)}
            </TabsContent>
            <TabsContent value="variables" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Enabled</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variables.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={item.enabled}
                          onCheckedChange={(checked) =>
                            updateVariable(index, "enabled", checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.key}
                          onChange={(e) =>
                            updateVariable(index, "key", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.value}
                          onChange={(e) =>
                            updateVariable(index, "value", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => removeVariable(index)}
                          variant="destructive"
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={addVariable} className="mt-2">
                Add Variable
              </Button>
            </TabsContent>
          </Tabs>
          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Loading..." : "Search"}
            </Button>
            <Button type="button" onClick={resetToDefaults} variant="outline">
              Reset to Defaults
            </Button>
          </div>
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
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
