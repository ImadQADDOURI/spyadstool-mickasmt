// app/lib/Meta-GraphQL-Queries.ts

import { AdData } from "@/types/ad";
import { metaGraphQLApi } from "@/app/actions/Meta-GraphQL-Api";

interface AdLibraryAdCollationDetailsQueryResult {
  ads: AdData[];
  forward_cursor: string | null;
  total_count: number;
  is_complete: boolean;
}
interface AdLibrarySearchPaginationQueryResult {
  count: number;
  ads: AdData[];
  end_cursor: string | null;
  has_next_page: boolean;
}
interface AdLibraryMobileFocusedStateProviderRefetchQueryResult {
  count: number;
  ads: AdData[];
  end_cursor: string | null;
  has_next_page: boolean;
  page_info: any;
  page: any;
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

    console.log("🚀🚀🚀🚀 - result ", result);
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

// Function to fetch ads by filter by pageID
// variables example normal Search   0 filters: {"activeStatus":"ALL","adType":"ALL","bylines":[],"collationToken":null,"contentLanguages":[],"countries":["ALL"],"cursor":"AQHR3E1VCNfnSwNk8uwi9rTjdrwGnsWl-GUN8FnIeRu1Xi_iKJWM5JIAFNrxvS3cmChA","excludedIDs":[],"first":30,"location":null,"mediaType":"ALL","pageIDs":[],"potentialReachInput":[],"publisherPlatforms":[],"queryString":"cat","regions":[],"searchType":"KEYWORD_UNORDERED","sessionID":"6f643586-6dae-4e72-bcb5-779de1d6815b","sortData":null,"source":"NAV_HEADER","startDate":null,"v":"7218b1","viewAllPageID":"0"}
// variables example normal Search All filters: {"activeStatus":"INACTIVE","adType":"ALL","bylines":[],"collationToken":null,"contentLanguages":["en","zh"],"countries":["ALL"],"cursor":"AQHR1YeuZJ1CH2ok6BxPdMO-DGPfDxJ7AyVR-1GOgZhONm1uzUeHEEPikE4VniBM5h68","excludedIDs":[],"first":30,"location":null,"mediaType":"VIDEO","pageIDs":["110757928736038","375132235684804","107180365516103","108498844313651","112869771908331","144939265372419"],"potentialReachInput":[],"publisherPlatforms":["FACEBOOK","INSTAGRAM","AUDIENCE_NETWORK","MESSENGER"],"queryString":"cat","regions":[],"searchType":"KEYWORD_UNORDERED","sessionID":"6f643586-6dae-4e72-bcb5-779de1d6815b","sortData":null,"source":"NAV_HEADER","startDate":{"max":"2024-09-22","min":"2018-05-07"},"v":"7218b1","viewAllPageID":"0"}
// variables example PageID search: {"activeStatus":"ACTIVE","adType":"ALL","bylines":[],"collationToken":null,"contentLanguages":null,"countries":["ALL"],"cursor":"AQHRcbL35kOZB3k1ZkVnc8vKTRR5GblNrFy4KxgiGv5ffJ_stE6kuWziroOxBL0JIrN8","excludedIDs":null,"first":30,"location":null,"mediaType":"all","pageIDs":null,"potentialReachInput":null,"publisherPlatforms":null,"queryString":"","regions":null,"searchType":null,"sessionID":null,"sortData":null,"source":null,"startDate":null,"v":"f67402","viewAllPageID":"602563393163238"}
export async function AdLibrarySearchPaginationQuery(
  variables: Record<string, any>,
): Promise<AdLibrarySearchPaginationQueryResult> {
  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name: "AdLibrarySearchPaginationQuery",
    });

    const searchResultsConnection =
      result.data?.ad_library_main?.search_results_connection;

    if (!searchResultsConnection) {
      throw new Error("Unexpected response structure");
    }

    const count = searchResultsConnection.count;
    const pageInfo = searchResultsConnection.page_info;
    const edges = searchResultsConnection.edges;

    // Extract and flatten ads from all nodes and their collated_results
    const ads = edges.flatMap((edge) =>
      edge.node.collated_results.flatMap((result) => result),
    );

    return {
      count,
      ads,
      end_cursor: pageInfo.end_cursor,
      has_next_page: pageInfo.has_next_page,
    };
  } catch (error) {
    console.error("Error in AdLibrarySearchPaginationQuery:", error);
    throw error;
  }
}

// Function to fetch Page ID Info with Page Ads
// variables example   0 Filters: {"activeStatus":"ALL","adType":"ALL","audienceTimeframe":"LAST_7_DAYS","bylines":[],"collationToken":"4c63fadb-145f-428f-9696-7e1824245ee8","contentLanguages":[],"countries":["ALL"],"country":"ALL","excludedIDs":[],"fetchPageInfo":true,"fetchSharedDisclaimers":true,"location":null,"mediaType":"ALL","pageIDs":[],"potentialReachInput":[],"publisherPlatforms":[],"queryString":"","regions":[],"searchType":"PAGE","sessionID":"d9c83232-8090-4de2-b3c5-b66c6cd7a137","sortData":null,"source":null,"startDate":null,"v":"eab698","viewAllPageID":"150008058381451"}
// variables example All Filters: {"activeStatus":"ACTIVE","adType":"ALL","audienceTimeframe":"LAST_7_DAYS","bylines":[],"collationToken":"08609c11-12c6-401e-8bcb-2b56b333b9c5","contentLanguages":["en","fr"],"countries":["ALL"],"country":"ALL","excludedIDs":[],"fetchPageInfo":true,"fetchSharedDisclaimers":true,"location":null,"mediaType":"VIDEO","pageIDs":[],"potentialReachInput":[],"publisherPlatforms":["FACEBOOK","INSTAGRAM"],"queryString":"","regions":[],"searchType":"PAGE","sessionID":"d9c83232-8090-4de2-b3c5-b66c6cd7a137","sortData":null,"source":null,"startDate":{"min":"2018-05-07","max":"2024-10-05"},"v":"eab698","viewAllPageID":"150008058381451"}
export async function AdLibraryMobileFocusedStateProviderRefetchQuery(
  variables: Record<string, any>,
): Promise<AdLibraryMobileFocusedStateProviderRefetchQueryResult> {
  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name:
        "AdLibraryMobileFocusedStateProviderRefetchQuery",
    });

    // Ensure we have the second JSON object
    if (!Array.isArray(result) || result.length < 2) {
      throw new Error("Unexpected response structure");
    }

    const data = result[1].data;

    if (!data || !data.ad_library_main) {
      throw new Error("Unexpected data structure in response");
    }

    const searchResultsConnection =
      data.ad_library_main.search_results_connection;
    const pageInfo = searchResultsConnection.page_info;

    // Extract and flatten ads from all edges and their collated_results
    const ads = searchResultsConnection.edges.flatMap((edge: any) =>
      edge.node.collated_results.flatMap((result: AdData) => result),
    );

    return {
      count: searchResultsConnection.count,
      ads,
      end_cursor: pageInfo.end_cursor,
      has_next_page: pageInfo.has_next_page,
      page_info: data.ad_library_page_info.page_info,
      page: data.page,
    };
  } catch (error) {
    console.error(
      "Error in AdLibraryMobileFocusedStateProviderRefetchQuery:",
      error,
    );
    throw error;
  }
}
