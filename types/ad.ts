// types/ad.ts

export interface Ad {
  adid?: string;
  adArchiveID?: string;
  collationCount?: number;
  collationID?: number;
  currency?: string;
  startDate?: number;
  endDate?: number;
  pageName?: string;
  pageID?: string;
  publisherPlatform?: string[];
  isActive?: boolean;
  isAAAEligible: boolean;
  snapshot: {
    ad_creative_id: string;
    body?: {
      markup?: {
        __html?: string;
      };
    };
    images?: Array<{
      title?: string;
      body?: string;
      cta_text?: string;
      original_image_url?: string;
      resized_image_url?: string;
    }>;
    videos?: Array<{
      title?: string;
      body?: string;
      cta_text?: string;
      video_hd_url?: string;
      video_sd_url?: string;
      video_preview_image_url?: string;
    }>;
    cards?: Array<{
      title?: string;
      body?: string;
      link_url?: string;
      caption?: string;
      cta_text?: string;
      cta_type?: string;
      original_image_url?: string;
      resized_image_url?: string;
      video_preview_image_url?: string;
    }>;
    page_profile_picture_url?: string;
    link_url?: string;
    cta_text?: string;
    cta_type?: string;
    title?: string;
    caption?: string;
    page_like_count?: number;
  };
  categories: number[];
  impressionsWithIndex?: {
    impressionsText?: string | null;
    impressionsIndex?: number;
  };
  spend?: {
    lower_bound?: string;
    upper_bound?: string;
  };
  reachEstimate?: {
    lower_bound?: string;
    upper_bound?: string;
  };
  entityType?: string;
  gatedType?: string;
  hideDataStatus?: string;
}

export interface AdsData {
  isResultComplete: boolean;
  forwardCursor: string;
  backwardCursor: string;
  totalCount: number;
  collationToken: string;
  ads: Ad[];
}
/*

export type SearchResults = {
  ads: Ad[];
  totalCount: number;
  isResultComplete: boolean;
  forwardCursor: string;
  backwardCursor: string;
  collationToken: string;
};

export type Ad = {
  adid: string;
  adArchiveID: string;
  archiveTypes: number[];
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
  reachEstimate: string | null;
  reportCount: number | null;
  snapshot: {
    ad_creative_id: string;
    cards?: {
      body: string;
      title: string;
      link_url: string;
      video_sd_url?: string;
      video_hd_url?: string;
      video_preview_image_url?: string;
    }[];
    videos?: {
      video_sd_url: string;
      video_hd_url: string;
      video_preview_image_url: string;
    }[];
    body_translations: Record<string, string>;
    byline: string | null;
    caption: string;
    cta_text: string;
    display_format: string;
    title: string | null;
    link_description: string | null;
    link_url: string;
    page_welcome_message: string | null;
    images: any[];
    creation_time: number;
    page_id: string;
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
    current_page_name: string;
    disclaimer_label: string | null;
    page_like_count: number;
    page_profile_uri: string;
    cta_type: string;
  };
  spend: string | null;
  stateMediaRunLabel: string | null;
  publisherPlatform: string[];
  menuItems: any[];
};
*/
