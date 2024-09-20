// ...  detector patterns & icons

export const icons: Record<string, string> = {
  // Pixels
  Meta: "/icons/meta.svg",
  Snapchat: "/icons/snapchat.svg",
  Google: "/icons/google.svg",
  LinkedIn: "/icons/linkedin.svg",
  Twitter: "/icons/twitter.svg",
  TikTok: "/icons/tiktok.svg",
  Pinterest: "/icons/pinterest.svg",
  Amazon: "/icons/amazon.svg",
  Microsoft: "/icons/microsoft.svg",
  Adobe: "/icons/adobe.svg",
  Criteo: "/icons/criteo.svg",
  Taboola: "/icons/taboola.svg",
  Outbrain: "/icons/outbrain.svg",
  ABTasty: "/icons/abtasty.svg",
  // Platforms
  Shopify: "/icons/shopify.svg",
  WooCommerce: "/icons/woocommerce.svg",
  Wix: "/icons/wix.svg",
  BigCommerce: "/icons/bigcommerce.svg",
  Magento: "/icons/magento.svg",
  PrestaShop: "/icons/prestashop.svg",
  OpenCart: "/icons/opencart.svg",
  Squarespace: "/icons/squarespace.svg",
  Shopware: "/icons/shopware.svg",
  YouCan: "/icons/youcan.png",
  Shoppy: "/icons/shoppy.svg",
  // Payments
  Stripe: "/icons/stripe.svg",
  PayPal: "/icons/paypal.svg",
  GooglePay: "/icons/googlepay.svg",
  ApplePay: "/icons/applepay.svg",
  AmazonPay: "/icons/amazonpay.svg",
  Square: "/icons/square.svg",
  Klarna: "/icons/klarna.svg",
  Affirm: "/icons/affirm.svg",
  Afterpay: "/icons/afterpay.svg",
  Venmo: "/icons/venmo.svg",
};

export interface TrackingDetector {
  name: string;
  patterns: string[];
}
// Detector patterns
// pixels detectos
export const trackingPixelDetectors: TrackingDetector[] = [
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
      "google-analytics",
      "googleadservices",
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
    patterns: ["analytics.tiktok.com", "tiktok.com/i18n", "analytics.tiktok"],
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
    patterns: ["outbrain.com/outbrain.js", "tr.outbrain.com", "outbrain.com"],
  },
  {
    name: "ABTasty",
    patterns: ["abtasty.com"],
  },
];

// platform detectors
export const platformDetectors: TrackingDetector[] = [
  {
    name: "Shopify",
    patterns: [
      "cdn.shopify.com",
      "shopify.com/s/files",
      "myshopify.com",
      "shopifycdn",
      "shopify",
    ],
  },
  {
    name: "WooCommerce",
    patterns: ["woocommerce", "wp-content/plugins/woocommerce"],
  },
  {
    name: "Wix",
    patterns: ["static.wixstatic.com", "wix.com"],
  },
  {
    name: "BigCommerce",
    patterns: ["bigcommerce.com", "bigcommercecdn.com"],
  },
  {
    name: "Magento",
    patterns: ["static.magento.com", "mage/cookies.js"],
  },
  {
    name: "PrestaShop",
    patterns: ["prestashop", "prestashop.com"],
  },
  {
    name: "OpenCart",
    patterns: ["opencart", "catalog/view/javascript/jquery/"],
  },
  {
    name: "Squarespace",
    patterns: ["squarespace.com", "static1.squarespace.com"],
  },
  {
    name: "Shopware",
    patterns: ["shopware", "shopware.com"],
  },
  {
    name: "YouCan",
    patterns: ["youcan.shop", "youcanassets.com"],
  },
  {
    name: "Shoppy",
    patterns: ["shoppy.gg", "cdn.shoppy.gg"],
  },
];

// payment method detectors
export const paymentDetectors: TrackingDetector[] = [
  {
    name: "Stripe",
    patterns: ["js.stripe.com", "stripe.com"],
  },
  {
    name: "PayPal",
    patterns: ["paypal.com/sdk", "paypalobjects.com"],
  },
  {
    name: "Google Pay",
    patterns: ["pay.google.com", "googleapis.com/pay"],
  },
  {
    name: "Apple Pay",
    patterns: ["apple-pay-gateway", "apple.com/apple-pay"],
  },
  {
    name: "Amazon Pay",
    patterns: ["static-na.payments-amazon.com", "amazonpay"],
  },
  {
    name: "Square",
    patterns: ["squareup.com", "square.com"],
  },
  {
    name: "Klarna",
    patterns: ["klarna.com", "klarnaservices.com"],
  },
  {
    name: "Affirm",
    patterns: ["affirm.com", "cdn1.affirm.com"],
  },
  {
    name: "Afterpay",
    patterns: ["afterpay.com", "static.afterpay.com"],
  },
  {
    name: "Venmo",
    patterns: ["venmo.com", "venmo.min.js"],
  },
];
