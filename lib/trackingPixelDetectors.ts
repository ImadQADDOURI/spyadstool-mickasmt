// app/lib/trackingPixelDetectors.ts

/**
 * This file contains a list of tracking pixel detectors used to identify various
 * tracking technologies employed by different companies on websites.
 *
 * Each detector consists of a name (usually the company or service) and an array
 * of patterns (typically URLs or script names) associated with their tracking methods.
 *
 * This list is used in conjunction with the detectTrackingPixels function to
 * analyze web pages and determine which tracking technologies are present.
 */

export interface TrackingPixelDetector {
  name: string;
  patterns: string[];
}

export const trackingPixelDetectors: TrackingPixelDetector[] = [
  {
    name: "Meta",
    patterns: [
      "connect.facebook.net",
      "facebook-jssdk",
      "facebook.com/tr",
      "instagram.com/embed.js",
      "facebook.com/plugins",
    ],
  },
  {
    name: "Snapchat",
    patterns: ["sc-static.net/scevent.min.js", "tr6.snapchat.com"],
  },
  {
    name: "Google",
    patterns: [
      "google-analytics.com/analytics.js",
      "googletagmanager.com/gtag/js",
      "googleadservices.com/pagead/conversion",
      "google.com/ads/ga-audiences",
    ],
  },
  {
    name: "LinkedIn",
    patterns: [
      "snap.licdn.com/li.lms-analytics/insight.min.js",
      "platform.linkedin.com",
    ],
  },
  {
    name: "Twitter",
    patterns: ["static.ads-twitter.com/uwt.js", "platform.twitter.com"],
  },
  {
    name: "TikTok",
    patterns: ["analytics.tiktok.com", "tiktok.com/i18n"],
  },
  {
    name: "Pinterest",
    patterns: ["pintrk", "assets.pinterest.com", "ct.pinterest.com"],
  },
  {
    name: "Amazon",
    patterns: ["amazon-adsystem.com", "assoc-amazon.com"],
  },
  {
    name: "Microsoft",
    patterns: ["clarity.ms", "bat.bing.com"],
  },
  {
    name: "Adobe",
    patterns: ["demdex.net", "omtrdc.net"],
  },
  {
    name: "Criteo",
    patterns: ["static.criteo.net"],
  },
  {
    name: "Taboola",
    patterns: ["cdn.taboola.com"],
  },
  {
    name: "Outbrain",
    patterns: ["outbrain.com/outbrain.js"],
  },
];
