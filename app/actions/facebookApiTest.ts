// app/actions/facebookApiTest.ts

import { cookies } from "next/headers";
import { z } from "zod";

// Define the input schema for the server action
const InputSchema = z.object({
  queryString: z.string().min(1),
  cursor: z.string().optional(),
});

// Define the output schema for the server action
const OutputSchema = z.object({
  data: z.string(),
});

export async function fetchFacebookAds(input: z.infer<typeof InputSchema>) {
  // Validate input
  const validatedInput = InputSchema.parse(input);

  // Prepare the request body
  const body = new URLSearchParams({
    av: "0",
    __user: "0",
    __a: "1",
    __req: "2r",
    lsd: "AVqy31NLRXs",
    jazoest: "2924",
    __spin_r: "1016694340",
    __spin_b: "trunk",
    __spin_t: "1726913729",
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "AdLibrarySearchPaginationQuery",
    variables: JSON.stringify({
      activeStatus: "ACTIVE",
      adType: "ALL",
      countries: ["MA"],
      cursor: validatedInput.cursor || null,
      first: 30,
      queryString: validatedInput.queryString,
      searchType: "KEYWORD_UNORDERED",
      sessionID: "3f156780-a547-4e64-8bcb-69402d0ce274",
      source: "NAV_HEADER",
    }),
    server_timestamps: "true",
    doc_id: "8022477101123416",
  });

  try {
    const cookieStore = cookies();
    const response = await fetch("https://www.facebook.com/api/graphql/", {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
        cookie: cookieStore.toString(),
        origin: "https://www.facebook.com",
        referer: "https://www.facebook.com/ads/library/",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "x-fb-friendly-name": "AdLibrarySearchPaginationQuery",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();

    // Validate output
    return OutputSchema.parse({ data });
  } catch (error) {
    console.error("Error fetching Facebook ads:", error);
    throw error;
  }
}
