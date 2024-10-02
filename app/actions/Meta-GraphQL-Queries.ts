// app/lib/Meta-GraphQL-Queries.ts

import { AdGraphQL } from "@/types/ad";
import { metaGraphQLApi } from "@/app/actions/Meta-GraphQL-Api";

interface AdLibraryAdCollationDetailsQueryResult {
  ads: AdGraphQL[];
  forward_cursor: string | null;
  total_count: number;
  is_complete: boolean;
}

// Function to fetch ad collation details
// variables example: {"collationGroupID":"1247580993346891","forwardCursor":null,"backwardCursor":null,"activeStatus":"ALL","adType":"ALL","bylines":[],"countries":null,"location":null,"potentialReach":[],"publisherPlatforms":[],"regions":[],"sessionID":"ca227fe6-a7d7-431f-a8a2-94d2e69d7da8","startDate":null}
export async function AdLibraryAdCollationDetailsQuery(
  variables: Record<string, any>,
): Promise<AdLibraryAdCollationDetailsQueryResult> {
  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name: "AdLibraryAdCollationDetailsQuery",
    });

    // Extract the relevant data from the result
    const collationResults = result.data?.ad_library_main?.collation_results;

    if (!collationResults) {
      throw new Error("Unexpected response structure");
    }

    return {
      ads: collationResults.ad_cards || [],
      forward_cursor: collationResults.forward_cursor,
      total_count: collationResults.total_count,
      is_complete: collationResults.is_complete,
    };
  } catch (error) {
    console.error("Error in AdLibraryAdCollationDetailsQuery:", error);
    throw error;
  }
}

// Function to fetch European Union Ad Details
// variables example: {"adArchiveID":"451740291243640","pageID":"432061063659239","country":"ALL","sessionID":"0162a99e-6971-4fb4-8a57-97c681e3f534","source":"FB_LOGO","isAdNonPolitical":true,"isAdNotAAAEligible":false}
export async function AdLibraryAdDetailsV2Query(
  variables: Record<string, any>,
): Promise<any> {
  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name: "AdLibraryAdDetailsV2Query",
    });
    console.log("🚀🚀🚀🚀 - AdLibraryAdDetailsV2Query ");

    return result;
  } catch (error) {
    console.error("Error in AdLibraryAdDetailsV2Query:", error);
    throw error;
  }
}
