// types/ad.ts
export interface MediaItem {
  title?: string;
  body?: string;
  cta_text?: string;
  cta_type?: string;
  link_description?: string | null;
  link_url?: string;
  original_image_url?: string;
  resized_image_url?: string;
  watermarked_resized_image_url?: string;
  image_crops?: Record<string, any>;
  video_hd_url?: string | null;
  video_sd_url?: string | null;
  video_preview_image_url?: string | null;
  watermarked_video_hd_url?: string | null;
  watermarked_video_sd_url?: string | null;
}

export interface AdsData {
  isResultComplete: boolean;
  forwardCursor: string;
  backwardCursor: string;
  totalCount: number;
  collationToken: string;
  ads: Ad[];
}

export interface Ad {
  adid: string;
  adArchiveID: string;
  archiveTypes: any[];
  categories: number[];
  containsDigitallyCreatedMedia: boolean;
  containsSensitiveContent: boolean;
  collationCount: number;
  collationID: number;
  currency: string;
  endDate: number;
  startDate: number;
  entityType: string;
  fevInfo: any;
  finServAdData: {
    is_deemed_finserv: boolean;
    is_limited_delivery: boolean;
  };
  gatedType: string;
  hasUserReported: boolean;
  hiddenSafetyData: boolean;
  hideDataStatus: string;
  impressionsWithIndex: {
    impressionsText: string | null;
    impressionsIndex: number;
  };
  isAAAEligible: boolean;
  isAdAccountActioned: boolean;
  isActive: boolean;
  isProfilePage: boolean;
  pageID: string;
  pageInfo: any;
  pageIsDeleted: boolean;
  pageName: string;
  politicalCountries: string[];
  reachEstimate: {
    lower_bound?: string;
    upper_bound?: string;
  } | null;
  reportCount: number | null;
  snapshot: {
    ad_creative_id: string;

    cards?: MediaItem[];

    body_translations: Record<string, string>;
    byline: string | null;
    caption: string | null;
    cta_text: string | null;
    dynamic_item_flags: Record<string, any>;
    dynamic_versions: any | null;
    edited_snapshots: any[];
    effective_authorization_category: string;
    event: any[];
    extra_images: any[];
    extra_links: any[];
    extra_texts: any[];
    extra_videos: any[];
    instagram_shopping_products: any[];
    display_format: string;
    title: string | null;
    link_description: string | null;
    link_url: string | null;
    page_welcome_message: string | null;

    images?: MediaItem[];

    videos?: MediaItem[];

    creation_time: number;
    page_id: string | number;
    page_name: string;
    page_profile_picture_url: string;
    page_categories: Record<string, string>;
    page_entity_type: string;
    page_is_profile_page: boolean;
    instagram_actor_name: string;
    instagram_profile_pic_url: string;
    instagram_url: string;
    instagram_handle: string;
    is_reshared: boolean;
    version: number;
    body: {
      context: Record<string, any>;
      markup: {
        __html: string;
      };
      callerHash: string;
    };
    brazil_tax_id: string | null;
    branded_content: any | null;
    current_page_name: string;
    disclaimer_label: string | null;
    page_like_count: number;
    page_profile_uri: string;
    page_is_deleted: boolean;
    root_reshared_post: any | null;
    cta_type: string | null;
    additional_info: any | null;
    ec_certificates: any | null;
    country_iso_code: string | null;
    instagram_branded_content: any | null;
  };
  spend: {
    lower_bound?: string;
    upper_bound?: string;
  } | null;
  stateMediaRunLabel: string | null;
  publisherPlatform: string[];
  menuItems: any[];
}

export interface AdData {
  ad_archive_id: string;
  ad_id: string | null;
  archive_types: string[];
  categories: string[];
  collation_count: number | null;
  collation_id: string | null;
  contains_digital_created_media: boolean;
  contains_sensitive_content: boolean;
  currency: string;
  end_date: number;
  entity_type: string;
  fev_info: any | null;
  finserv_ad_data: {
    is_deemed_finserv: boolean;
    is_limited_delivery: boolean;
  };
  gated_type: string;
  has_user_reported: boolean;
  hidden_safety_data: boolean;
  hide_data_status: string;
  impressions_with_index: {
    impressions_text: string | null;
    impressions_index: number;
  };
  is_aaa_eligible: boolean;
  is_active: boolean;
  is_profile_page: boolean;
  menu_items: any[];
  page_id: string;
  page_is_deleted: boolean;
  page_name: string;
  political_countries: string[];
  publisher_platform: string[];
  reach_estimate: any | null;
  report_count: number | null;
  snapshot: {
    body: {
      text: string;
    };
    branded_content: {
      current_page_name: string;
      page_categories: string[];
      page_id: string;
      page_is_deleted: boolean;
      page_name: string;
      page_profile_pic_url: string;
      page_profile_uri: string;
    } | null;
    brazil_tax_id: string | null;
    byline: string | null;
    caption: string | null;
    cards: Media[];
    cta_text: string;
    cta_type: string;
    country_iso_code: string | null;
    current_page_name: string;
    disclaimer_label: string | null;
    display_format: string;
    event: any | null;
    images: Media[];
    is_reshared: boolean;
    link_description: string | null;
    link_url: string | null;
    page_categories: string[];
    page_entity_type: string;
    page_id: string;
    page_is_deleted: boolean;
    page_is_profile_page: boolean;
    page_like_count: number;
    page_name: string;
    page_profile_picture_url: string;
    page_profile_uri: string;
    root_reshared_post: any | null;
    title: string | null;
    videos: Media[];
    additional_info: any | null;
    ec_certificates: any[];
    extra_images: any[];
    extra_links: any[];
    extra_texts: any[];
    extra_videos: any[];
  };
  spend: any | null;
  start_date: number;
  state_media_run_label: string | null;
}

interface Media {
  body?: string;
  caption?: string;
  cta_text?: string;
  cta_type?: string;
  image_crops?: any[];
  link_description?: string | null;
  link_url?: string;
  original_image_url?: string | null;
  resized_image_url?: string | null;
  watermarked_resized_image_url?: string | null;
  title?: string;
  video_hd_url?: string;
  video_preview_image_url?: string;
  video_sd_url?: string;
  watermarked_video_hd_url?: string;
  watermarked_video_sd_url?: string;
}
