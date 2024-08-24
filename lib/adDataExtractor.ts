// lib/adDataExtractor.ts

import { Ad } from "../types/ad";

export const extractAdsFromResults = (results: any[]): Ad[] => {
  return results.flatMap((monthGroup) =>
    monthGroup
      .filter((ad: any) => ad.collationCount !== undefined)
      .map((ad: any) => {
        const extractedAd: Partial<Ad> = {};

        // Dynamically extract all available fields from the ad object
        for (const key in ad) {
          if (Object.prototype.hasOwnProperty.call(ad, key)) {
            (extractedAd as any)[key] = ad[key];
          }
        }

        return extractedAd as Ad;
      }),
  );
};
