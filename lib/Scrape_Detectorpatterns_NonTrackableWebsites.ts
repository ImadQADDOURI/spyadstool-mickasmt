// Detector patterns &  Non Trackable Websites

export interface TrackingDetector {
  name: string;
  patterns: string[];
  icon: string;
}

// Tracking Pixel Detectors
export const trackingPixelDetectors: TrackingDetector[] = [
  {
    name: "Meta",
    patterns: [
      "connect.facebook.net",
      "facebook-jssdk",
      "facebook.com/tr",
      "instagram.com/embed.js",
      "facebook.com/plugins",
      "fbevents.js",
      "pixel.facebook.com",
    ],
    icon: "/icons/meta.svg",
  },
  {
    name: "Snapchat",
    patterns: [
      "sc-static.net/scevent.min.js",
      "tr6.snapchat.com",
      "sc-cdn.net",
      "snapchat.com/pixel",
    ],
    icon: "/icons/snapchat.svg",
  },
  {
    name: "Google Analytics",
    patterns: [
      "google-analytics.com/analytics.js",
      "googletagmanager.com/gtag/js",
      "google-analytics.com/ga.js",
      "google-analytics.com/collect",
      "analytics.google.com",
    ],
    icon: "/icons/googleanalytics.svg",
  },
  {
    name: "Google Ads",
    patterns: [
      "googleadservices.com/pagead/conversion",
      "google.com/ads/ga-audiences",
      "googleadservices.com",
      "googlesyndication.com",
      "doubleclick.net",
    ],
    icon: "/icons/googleads.svg",
  },
  {
    name: "LinkedIn",
    patterns: [
      "snap.licdn.com/li.lms-analytics/insight.min.js",
      "platform.linkedin.com",
      "linkedin.com/px",
      "linkedin.com/analytics",
    ],
    icon: "/icons/linkedin.svg",
  },
  {
    name: "Twitter",
    patterns: [
      "static.ads-twitter.com/uwt.js",
      "platform.twitter.com",
      "analytics.twitter.com",
      "twitter.com/i/adsct",
    ],
    icon: "/icons/twitter.svg",
  },
  {
    name: "TikTok",
    patterns: [
      "analytics.tiktok.com",
      "tiktok.com/i18n",
      "analytics.tiktok",
      "tiktok.com/pixel",
    ],
    icon: "/icons/tiktok.svg",
  },
  {
    name: "Pinterest",
    patterns: [
      "pintrk",
      "assets.pinterest.com",
      "ct.pinterest.com",
      "pinterest.com/pin/create/button",
    ],
    icon: "/icons/pinterest.svg",
  },
  {
    name: "Amazon",
    patterns: [
      "amazon-adsystem.com",
      "assoc-amazon.com",
      "amazon-adsystem.com/aax2/apstag.js",
    ],
    icon: "/icons/amazon.svg",
  },
  {
    name: "Microsoft",
    patterns: [
      "clarity.ms",
      "bat.bing.com",
      "microsofttranslator.com",
      "microsoft.com/clarity",
    ],
    icon: "/icons/microsoft.svg",
  },
  {
    name: "Adobe",
    patterns: [
      "demdex.net",
      "omtrdc.net",
      "adobe.com/dtm",
      "adobe.com/b/ss",
      "2o7.net",
    ],
    icon: "/icons/adobe.svg",
  },
  {
    name: "Criteo",
    patterns: ["static.criteo.net", "criteo.com/js", "criteo.net/js"],
    icon: "/icons/criteo.svg",
  },
  {
    name: "Taboola",
    patterns: ["cdn.taboola.com", "trc.taboola.com", "taboola.com/libtrc"],
    icon: "/icons/taboola.svg",
  },
  {
    name: "Outbrain",
    patterns: [
      "outbrain.com/outbrain.js",
      "tr.outbrain.com",
      "outbrain.com",
      "ob.com",
    ],
    icon: "/icons/outbrain.svg",
  },
  {
    name: "ABTasty",
    patterns: ["abtasty.com", "cdn.abtasty.com"],
    icon: "/icons/abtasty.svg",
  },
  {
    name: "Google Tag Manager",
    patterns: ["googletagmanager.com/gtm.js", "gtm.js", "dataLayer"],
    icon: "/icons/googletagmanager.svg",
  },
  {
    name: "FloodLight",
    patterns: ["fls.doubleclick.net", "ad.doubleclick.net"],
    icon: "/icons/floodlight.svg",
  },
  {
    name: "Umami",
    patterns: ["umami.js", "umami.is"],
    icon: "/icons/umami.svg",
  },
  {
    name: "Amplitude",
    patterns: ["amplitude.com/libs", "cdn.amplitude.com"],
    icon: "/icons/amplitude.svg",
  },
  {
    name: "AppsFlyer",
    patterns: ["appsflyer.com", "af-event-logger"],
    icon: "/icons/appsflyer.svg",
  },
  {
    name: "Mixpanel",
    patterns: ["mixpanel.com", "cdn.mxpnl.com"],
    icon: "/icons/mixpanel.svg",
  },
  {
    name: "Plausible",
    patterns: ["plausible.io/js", "plausible.io/api"],
    icon: "/icons/plausible.svg",
  },
];

// Platform Detectors
export const platformDetectors: TrackingDetector[] = [
  {
    name: "Shopify",
    patterns: [
      "cdn.shopify.com",
      "shopify.com/s/files",
      "myshopify.com",
      "shopifycdn",
      "shopify.com/checkout",
      "shopify.com/storefront",
    ],
    icon: "/icons/shopify.svg",
  },
  {
    name: "WooCommerce",
    patterns: [
      "woocommerce",
      "wp-content/plugins/woocommerce",
      "wc-api",
      "wc_ajax",
      "woocommerce-gateway",
    ],
    icon: "/icons/woocommerce.svg",
  },
  {
    name: "Wix",
    patterns: [
      "static.wixstatic.com",
      "wix.com",
      "wixsite.com",
      "parastorage.com",
    ],
    icon: "/icons/wix.svg",
  },
  {
    name: "BigCommerce",
    patterns: [
      "bigcommerce.com",
      "bigcommercecdn.com",
      "mybigcommerce.com",
      "bc-sf-filter",
    ],
    icon: "/icons/bigcommerce.svg",
  },
  {
    name: "Magento",
    patterns: [
      "static.magento.com",
      "mage/cookies.js",
      "mage/mage.js",
      "enterprise.magento",
      "magento-version",
    ],
    icon: "/icons/magento.svg",
  },
  {
    name: "PrestaShop",
    patterns: [
      "prestashop",
      "prestashop.com",
      "presta-shop.com",
      "prestashop-modules",
    ],
    icon: "/icons/prestashop.svg",
  },
  {
    name: "OpenCart",
    patterns: [
      "opencart",
      "catalog/view/javascript/jquery/",
      "index.php?route=",
      "opencart.com",
    ],
    icon: "/icons/opencart.svg",
  },
  {
    name: "Squarespace",
    patterns: [
      "squarespace.com",
      "static1.squarespace.com",
      "sqsp.net",
      "squarespace-cdn.com",
    ],
    icon: "/icons/squarespace.svg",
  },
  {
    name: "Shopware",
    patterns: ["shopware", "shopware.com", "shopware-ag", "shopware.store"],
    icon: "/icons/shopware.svg",
  },
  {
    name: "YouCan",
    patterns: ["youcan.shop", "youcanassets.com", "youcan-pay"],
    icon: "/icons/youcan.png",
  },
  {
    name: "Shoppy",
    patterns: ["shoppy.gg", "cdn.shoppy.gg", "shoppy-cdn"],
    icon: "/icons/shoppy.svg",
  },
  {
    name: "Webflow",
    patterns: ["webflow.com", "webflow.io", "assets.website-files.com"],
    icon: "/icons/webflow.svg",
  },
  {
    name: "Weebly",
    patterns: ["weebly.com", "editmysite.com", "weeblysite.com"],
    icon: "/icons/weebly.svg",
  },
  {
    name: "Etsy",
    patterns: ["etsy.com", "etsystatic.com", "etsy.me"],
    icon: "/icons/etsy.svg",
  },
];

// Payment Method Detectors
export const paymentDetectors: TrackingDetector[] = [
  {
    name: "Stripe",
    patterns: [
      "js.stripe.com",
      "stripe.com",
      "checkout.stripe.com",
      "stripe-js",
    ],
    icon: "/icons/stripe.svg",
  },
  {
    name: "PayPal",
    patterns: [
      "paypal.com/sdk",
      "paypalobjects.com",
      "paypal.com/buttons",
      "paypal.com/smart-payment-buttons",
    ],
    icon: "/icons/paypal.svg",
  },
  {
    name: "Google Pay",
    patterns: [
      "pay.google.com",
      "googleapis.com/pay",
      "google.com/pay",
      "pay.google.com/gp/p",
    ],
    icon: "/icons/googlepay.svg",
  },
  {
    name: "Apple Pay",
    patterns: [
      "apple-pay-gateway",
      "apple.com/apple-pay",
      "applepay.cdn-apple.com",
    ],
    icon: "/icons/applepay.svg",
  },
  {
    name: "Amazon Pay",
    patterns: [
      "static-na.payments-amazon.com",
      "amazonpay",
      "amazon.com/payments",
    ],
    icon: "/icons/amazonpay.svg",
  },
  {
    name: "Square",
    patterns: [
      "squareup.com",
      "square.com",
      "squarecdn.com",
      "square-payment-form",
    ],
    icon: "/icons/square.svg",
  },
  {
    name: "Klarna",
    patterns: [
      "klarna.com",
      "klarnaservices.com",
      "klarna-payments",
      "klarna-checkout",
    ],
    icon: "/icons/klarna.svg",
  },
  {
    name: "Affirm",
    patterns: ["affirm.com", "cdn1.affirm.com", "affirm-sdk", "affirm.js"],
    icon: "/icons/affirm.svg",
  },
  {
    name: "Afterpay",
    patterns: ["afterpay.com", "static.afterpay.com", "afterpay-js-sdk"],
    icon: "/icons/afterpay.svg",
  },
  {
    name: "Venmo",
    patterns: ["venmo.com", "venmo.min.js", "venmo-web"],
    icon: "/icons/venmo.svg",
  },
  {
    name: "Adyen",
    patterns: [
      "adyen.com",
      "checkoutshopper-live.adyen.com",
      "adyen-encryption-web",
    ],
    icon: "/icons/adyen.png",
  },
  {
    name: "Braintree",
    patterns: [
      "braintreegateway.com",
      "braintree-api.com",
      "braintreepayments.com",
    ],
    icon: "/icons/braintree.png",
  },
  {
    name: "2Checkout",
    patterns: ["2checkout.com", "avangate.com", "2co.com"],
    icon: "/icons/k2checkout.png",
  },
  {
    name: "Authorize.Net",
    patterns: ["authorize.net", "authorizenet.net", "accept.js"],
    icon: "/icons/authorizenet.svg",
  },
];

// Non Trackable Websites

/**
 * List of websites where tracking pixels, frameworks, and payment systems
 * are typically not applicable or cannot be detected.
 *
 * This list includes major social media platforms, search engines, and other
 * popular websites that either don't use common tracking systems or where
 * attempting to detect such systems would be unnecessary or unproductive.
 *
 * Use this list to prevent unnecessary tracking attempts and improve user experience
 * by providing appropriate feedback for these websites.
 */
export const nonTrackableWebsites = [
  // Social Media
  "facebook.com",
  "fb.com",
  "fb.me",
  "messenger.com",
  "whatsapp.com",
  "web.whatsapp.com",
  "instagram.com",
  "www.instagram.com",
  "twitter.com",
  "t.co",
  "x.com",
  "linkedin.com",
  "lnkd.in",
  "youtube.com",
  "youtu.be",
  "tiktok.com",
  "vm.tiktok.com",
  "snapchat.com",
  "pinterest.com",
  "pin.it",
  "reddit.com",
  "redd.it",
  "tumblr.com",
  "quora.com",
  "vk.com",
  "weibo.com",
  "line.me",
  "telegram.org",
  "t.me",

  // Professional Networks
  "github.com",
  "githubusercontent.com",
  "stackoverflow.com",
  "stackexchange.com",
  "gitlab.com",
  "bitbucket.org",

  // Content Platforms
  "medium.com",
  "wordpress.com",
  "wp.com",
  "blogger.com",
  "blogspot.com",
  "substack.com",

  // Knowledge Bases
  "wikipedia.org",
  "wikimedia.org",
  "wikihow.com",
  "quizlet.com",

  // Search Engines
  "google.com",
  "goo.gl",
  "bing.com",
  "yahoo.com",
  "yho.com",
  "duckduckgo.com",
  "baidu.com",
  "yandex.com",
  "ya.ru",

  // E-commerce and Entertainment
  "amazon.com",
  "amzn.to",
  "netflix.com",
  "nflx.it",
  "spotify.com",
  "spoti.fi",
  "apple.com",
  "microsoft.com",
  "msft.it",
  "twitch.tv",
  "vimeo.com",
  "hulu.com",
  "disneyplus.com",
  "ebay.com",
  "aliexpress.com",
  "booking.com",
  "airbnb.com",

  // Productivity and Communication
  "slack.com",
  "discord.com",
  "discord.gg",
  "zoom.us",
  "teams.microsoft.com",
  "meet.google.com",
  "dropbox.com",
  "db.tt",
  "box.com",
  "drive.google.com",
  "onedrive.live.com",
  "evernote.com",
  "notion.so",

  // News and Media
  "nytimes.com",
  "wsj.com",
  "bbc.com",
  "bbc.co.uk",
  "cnn.com",
  "forbes.com",
  "reuters.com",

  // Email Services
  "gmail.com",
  "outlook.com",
  "yahoo.mail.com",
  "protonmail.com",

  // Educational Platforms
  "coursera.org",
  "edx.org",
  "udemy.com",
  "khanacademy.org",

  // File Sharing
  "wetransfer.com",
  "mediafire.com",
  "mega.nz",

  // Gaming Platforms
  "steampowered.com",
  "steamcommunity.com",
  "epicgames.com",
  "ea.com",
  "blizzard.com",

  // Miscellaneous
  "w3.org",
  "archive.org",
  "imdb.com",
  "yelp.com",
  "tripadvisor.com",
  "weather.com",
];

export const isNonTrackableWebsite = (url: string): boolean => {
  return nonTrackableWebsites.some((domain) => url.includes(domain));
};
