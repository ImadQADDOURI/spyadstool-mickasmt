// @/app/actions/buildFbAdsLibUrl.ts
import { FilterParams } from "@/types/filterParams";

export async function buildFbAdsLibUrl(filters: FilterParams): Promise<string> {
  try {
    const baseUrl =
      filters.baseUrl ||
      "https://www.facebook.com/ads/library/async/search_ads?";
    const params: { [key: string]: string | number } = {};

    // Helper function to add a parameter if it exists
    const addParam = (
      key: string,
      value: string | number | undefined | null,
    ) => {
      if (value !== undefined && value !== null && value !== "") {
        params[key] = value;
      }
    };

    // collation_group_id
    if (filters.collation_group_id)
      params["collation_group_id"] = filters.collation_group_id;

    // Add required fields with default values if not provided
    params["ad_type"] = filters.ad_type || "all";
    params["active_status"] = filters.active_status || "all";
    params["media_type"] = filters.media_type || "all";
    params["count"] = filters.count || 30;
    params["excluded-ids[0]"] = "1657611331670372";

    // Add optional parameters
    addParam("q", filters.q);
    addParam("v", filters.v);
    addParam("session_id", filters.session_id);
    addParam("sort_data[direction]", filters.sort_data); //"desc"
    addParam("sort_data[mode]", filters.sort_mode); // "relevancy_monthly_grouped"
    addParam("search_type", filters.search_type); //"keyword_unordered" // keyword_exact_phrase
    addParam("forward_cursor", filters.forward_cursor);
    addParam("backward_cursor", filters.backward_cursor);
    addParam("collation_token", filters.collation_token);
    addParam("view_all_page_id", filters.view_all_page_id);

    // Handle date ranges
    addParam("start_date[min]", filters.start_date_min);
    addParam("start_date[max]", filters.start_date_max);

    // Handle category_as_keyword
    let searchQuery = filters.q || "";
    if (filters.category_as_keyword) {
      searchQuery += (searchQuery ? ", " : "") + filters.category_as_keyword;
    }
    // Use the addParam function to add the combined query
    addParam("q", searchQuery);

    // Handle arrays
    if (filters.page_ids && filters.page_ids.length > 0) {
      filters.page_ids.forEach((id, index) => {
        params[`page_ids[${index}]`] = id;
      });
    }

    if (filters.countries && filters.countries.length > 0) {
      filters.countries.forEach((country, index) => {
        params[`countries[${index}]`] = country;
      });
    } else {
      params["countries[0]"] = "ALL";
    }

    if (filters.publisher_platforms && filters.publisher_platforms.length > 0) {
      filters.publisher_platforms.forEach((platform, index) => {
        params[`publisher_platforms[${index}]`] = platform;
      });
    }

    if (filters.content_languages && filters.content_languages.length > 0) {
      filters.content_languages.forEach((lang, index) => {
        params[`content_languages[${index}]`] = lang;
      });
    }

    console.log("🚀🚀🚀🚀 ~ buildFbAdsLibUrl ~ baseUrl:", baseUrl);

    console.log("🚀🚀🚀🚀 ~ buildFbAdsLibUrl ~ params:", params);

    const queryString = new URLSearchParams(params as any).toString();

    const urlWithParams = baseUrl + queryString;

    // console.log("🚀🚀🚀🚀 ~ buildFbAdsLibUrl ~ urlWithParams:", urlWithParams);

    return urlWithParams;
  } catch (error) {
    console.error("❌ Error occurred while building the URL:", error);
    throw new Error("Failed to build the Facebook Ads Library URL");
  }
}
