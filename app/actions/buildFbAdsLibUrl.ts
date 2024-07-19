// @/app/actions/buildFbAdsLibUrl.ts
import { FilterParams } from "@/types/filterParams";

export async function buildFbAdsLibUrl(filters: FilterParams): Promise<string> {
  try {
    const baseUrl = "https://www.facebook.com/ads/library/async/search_ads?";

    const params: { [key: string]: string | number } = {
      q: filters.q || "",
      v: filters.v || "",
      session_id: filters.session_id || "",
      count: filters.count ?? 30,
      active_status: filters.active_status || "all",
      ad_type: filters.ad_type || "all",
      media_type: filters.media_type || "all",
      "sort_data[direction]": filters.sort_direction || "desc",
      "sort_data[mode]": filters.sort_mode || "relevancy_monthly_grouped",
      search_type: filters.search_type || "keyword_unordered",
      forward_cursor: filters.forward_cursor || "",
      backward_cursor: filters.backward_cursor || "",
      collation_token: filters.collation_token || "",
    };

    if (filters.page_ids) {
      filters.page_ids.forEach((id, index) => {
        params[`page_ids[${index}]`] = id;
      });
    }

    if (filters.countries && filters.countries[0] !== "") {
      filters.countries.forEach((country, index) => {
        params[`countries[${index}]`] = country;
      });
    } else {
      params["countries[0]"] = "ALL";
    }

    if (filters.publisher_platforms) {
      filters.publisher_platforms.forEach((platform, index) => {
        params[`publisher_platforms[${index}]`] = platform;
      });
    }

    if (filters.start_date_min) {
      params["start_date[min]"] = filters.start_date_min;
    }

    if (filters.start_date_max) {
      params["start_date[max]"] = filters.start_date_max;
    }

    if (filters.content_languages) {
      filters.content_languages.forEach((lang, index) => {
        params[`content_languages[${index}]`] = lang;
      });
    }

    console.log("🚀🚀🚀🚀 ~ buildFbAdsLibUrl ~ params:", params);

    const queryString = new URLSearchParams(params as any).toString();
    return baseUrl + queryString;
  } catch (error) {
    console.error("❌ Error occurred while building the URL:", error);
    throw new Error("Failed to build the Facebook Ads Library URL");
  }
}

// Example usage
// const urlf = buildFbAdsLibUrl({
//   page_ids: ["103417645379531", "237627616089809"],
//   q: "dog",
//   count: 30,
//   active_status: "all",
//   ad_type: "all",
//   countries: ["ALL"],
//   publisher_platforms: ["facebook", "instagram"],
//   start_date_min: "2020-05-07",
//   start_date_max: "2024-05-08",
//   media_type: "all",
//   content_languages: ["en", "ar", "es"],
//   sort_direction: "desc",
//   sort_mode: "relevancy_monthly_grouped",
//   search_type: "keyword_unordered",
// });

// console.log(urlf);
