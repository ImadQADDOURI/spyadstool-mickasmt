// app/actions/Meta-GraphQL-Api.ts
"use server";

import {
  API_ENDPOINT,
  apiNameToDocId,
  defaultHeaders,
  defaultParams,
} from "@/lib/metaGraphQLConstants";

type MetaGraphQLApiProps = {
  variables?: Record<string, any>;
  fb_api_req_friendly_name?: string;
};

function parseJsonObjects(text: string): any[] {
  const results: any[] = [];
  let bracketCount = 0;
  let currentObject = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === "{") {
      bracketCount++;
    } else if (char === "}") {
      bracketCount--;
    }

    currentObject += char;

    if (bracketCount === 0 && currentObject.trim() !== "") {
      try {
        const parsedObject = JSON.parse(currentObject);
        results.push(parsedObject);
        currentObject = "";
      } catch (error) {
        console.error("Error parsing JSON object:", error);
      }
    }
  }

  return results;
}

export async function metaGraphQLApi({
  variables,
  fb_api_req_friendly_name,
}: MetaGraphQLApiProps) {
  try {
    const headers = { ...defaultHeaders };
    const params = { ...defaultParams };

    if (variables) {
      params.variables = JSON.stringify(variables);
    }

    if (fb_api_req_friendly_name) {
      params.fb_api_req_friendly_name = fb_api_req_friendly_name;
      headers["x-fb-friendly-name"] = fb_api_req_friendly_name;
      params.doc_id =
        apiNameToDocId[
          fb_api_req_friendly_name as keyof typeof apiNameToDocId
        ] || params.doc_id;
    }

    const body = new URLSearchParams(params);

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: headers as HeadersInit,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    // Use our optimized parser to handle multiple JSON objects
    const parsedData = parseJsonObjects(text);

    if (parsedData.length === 0) {
      throw new Error("No valid JSON objects found in the response");
    }
    console.log("🔧🔧🔧🔧 ~ Meta-GraphQL-Api ");
    return parsedData.length === 1 ? parsedData[0] : parsedData;
  } catch (error) {
    console.error("Error in metaGraphQLApi:", error);
    throw error;
  }
}

{
  /* Meta GraphQL API Server Action Summary
  
  # Meta GraphQL API Server Action

## Key Features:
1. Flexible GraphQL requests to Meta (Facebook) API
2. Handles multiple JSON objects in a single response
3. Customizable headers and parameters
4. Error handling and logging

## Usage:

```typescript
import { metaGraphQLApi } from '@/app/actions/Meta-GraphQL-Api';

const result = await metaGraphQLApi({
  variables: {
    // Your GraphQL variables here
  },
  fb_api_req_friendly_name: "AdLibrarySearchPaginationQuery" // or other query names
});
```

## Input:
- `variables`: Object containing GraphQL query variables
- `fb_api_req_friendly_name`: String identifying the specific API query

## Returned Result:
- Single object if only one JSON object is returned
- Array of objects if multiple JSON objects are returned

## Handling Results:

```typescript
if (Array.isArray(result)) {
  // Handle multiple returned objects
  result.forEach(item => {
    // Process each item
  });
} else {
  // Handle single returned object
  // Process result directly
}
```

## Error Handling:
- The action throws errors for HTTP issues or invalid responses
- Implement try-catch in the calling code to handle errors

## Notes:
- Uses predefined headers and parameters, customizable if needed
- Automatically selects appropriate `doc_id` based on `fb_api_req_friendly_name`
- Parses complex responses with multiple JSON objects
- Designed for server-side use in Next.js applications

  */
}
