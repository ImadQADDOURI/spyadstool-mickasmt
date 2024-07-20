// @/types/filterParams.ts
export type FilterParams = {
  //URL
  baseUrl?: string;

  //session
  v?: string | null;
  session_id?: string | null;

  //search
  countries?: string[] | null;
  ad_type?: string | null;
  q?: string | null;

  //filters
  content_languages?: string[] | null;
  page_ids?: string[] | null;
  publisher_platforms?: string[] | null;
  media_type?: string | null;
  active_status?: string | null;
  start_date_min?: string | null;
  start_date_max?: string | null;

  //sorting
  sort_direction?: string | null;
  sort_mode?: string | null;
  search_type?: string | null;
  count?: number | null;

  //pagination
  forward_cursor?: string | null;
  backward_cursor?: string | null;
  collation_token?: string | null;

  //Ad Details
  collation_group_id?: number;
};
