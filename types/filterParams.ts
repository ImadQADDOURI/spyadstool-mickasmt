// @/types/filterParams.ts
export type FilterParams = {
  //session
  v?: string;
  session_id?: string;

  //search
  countries?: string[];
  ad_type?: string;
  q?: string;

  //filters
  content_languages?: string[];
  page_ids?: string[];
  publisher_platforms?: string[];
  media_type?: string | null;
  active_status?: string;
  start_date_min?: string;
  start_date_max?: string;

  //sorting
  sort_direction?: string;
  sort_mode?: string;
  search_type?: string;
  count?: number;

  //pagination
  forward_cursor?: string;
  backward_cursor?: string;
  collation_token?: string;
};
