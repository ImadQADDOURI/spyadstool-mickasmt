interface CleanedAd {
  adArchiveID: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
}

export interface interfaceCleanedData {
  isResultComplete: boolean;
  forwardCursor: string;
  backwardCursor: string;
  totalCount: number;
  collationToken: string;
  ads: CleanedAd[];
}

export function cleanAdData(data: any): interfaceCleanedData {
  const payload = data.payload;

  const cleanedData: interfaceCleanedData = {
    isResultComplete: payload.isResultComplete,
    forwardCursor: payload.forwardCursor,
    backwardCursor: payload.backwardCursor,
    totalCount: payload.totalCount,
    collationToken: payload.collationToken,
    ads: [],
  };

  // Flatten the nested arrays and extract required fields
  payload.results.forEach((adArray: any[]) => {
    adArray.forEach((ad: any) => {
      cleanedData.ads.push({
        adArchiveID: ad.adArchiveID,
        startDate: ad.startDate,
        endDate: ad.endDate,
        isActive: ad.isActive,
      });
    });
  });

  return cleanedData;
}
