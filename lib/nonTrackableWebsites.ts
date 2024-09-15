// nonTrackableWebsites.ts

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
  "facebook.com",
  "fb.com",
  "whatsapp.com",
  "instagram.com",
  "twitter.com",
  "linkedin.com",
  "youtube.com",
  "tiktok.com",
  "snapchat.com",
  "pinterest.com",
  "reddit.com",
  "tumblr.com",
  "quora.com",
  "github.com",
  "stackoverflow.com",
  "medium.com",
  "wikipedia.org",
  "google.com",
  "bing.com",
  "yahoo.com",
  "duckduckgo.com",
  "amazon.com",
  "netflix.com",
  "spotify.com",
  "apple.com",
  "microsoft.com",
  "twitch.tv",
  "vimeo.com",
  "slack.com",
  "discord.com",
  "zoom.us",
];

export const isNonTrackableWebsite = (url: string): boolean => {
  return nonTrackableWebsites.some((domain) => url.includes(domain));
};
