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
