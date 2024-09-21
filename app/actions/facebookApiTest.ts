// app/actions/facebookApiTest.ts
"use server";

import { z } from "zod";

const HeaderSchema = z.record(z.string());
const ParamSchema = z.record(
  z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

const InputSchema = z.object({
  headers: HeaderSchema,
  params: ParamSchema,
});

export async function fetchFacebookAds(input: z.infer<typeof InputSchema>) {
  const { headers, params } = InputSchema.parse(input);

  const options = {
    method: "POST",
    headers: headers,
    body: new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ),
  };

  try {
    const response = await fetch(
      "https://www.facebook.com/api/graphql/",
      options,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching Facebook ads:", error);
    throw error;
  }
}
