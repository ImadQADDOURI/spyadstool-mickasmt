// app/actions/fetchAdDetails.ts

// app/actions/metaAdsLibrary.ts

"use server";

import { cookies } from "next/headers";

interface AdLibraryQueryVariables {
  adArchiveID: string;
  pageID: string;
  country?: string;
  sessionID?: string;
  source?: string;
  isAdNonPolitical?: boolean;
  isAdNotAAAEligible: boolean;
}

export async function fetchAdLibraryDetails(
  variables: AdLibraryQueryVariables,
) {
  const cookieStore = cookies();

  // Default values
  const defaultVariables = {
    source: "FB_LOGO",
    isAdNonPolitical: true,
    // sessionID: "25ac405f-b00b-47a5-837c-6e45899967dd",
    country: "",
  };

  // Merge default variables with provided variables
  const mergedVariables = { ...defaultVariables, ...variables };
  console.log("🚀🚀🚀🚀 ~ EU AD STATISTICS Params: ", mergedVariables);

  const formData = new URLSearchParams({
    av: cookieStore.get("c_user")?.value || "",
    __user: cookieStore.get("c_user")?.value || "",
    __a: "1",
    __req: "1d",
    __hs: "19951.HYP:comet_plat_default_pkg.2.1..2.1",
    dpr: "1",
    __ccg: "EXCELLENT",
    __rev: "1015733964",
    __s: "6vti6r:2alau7:x3ofdh",
    __hsi: "7403734392854487362",
    __dyn:
      "7xeUmxa13yoS1syUbFp432m2q1Dxu13wqovzEdF8ixy360CEbo9E3-xS6Ehw2nVEK12wvk0gq78b87C2m3K2y11wBz81s8hwGwQwoEcE7O2l0Fwqo31wp8kwyx2cwAxq1izXwrUcUjwGzE2VKUbo5G4EG1MUlwhE2Lxiaw5rwSyES0gq0K-1Lwqp8aE2cwmo6O1Fw5VwtUbUaU",
    __csr:
      "hInNqibAquHsGAzbhWjKi46Khv_4Z4HVik_FeGXVF5DDuBmF6WOvcdBQ0hWawjo2ZwIwi81_80s3w027d80ff8",
    __comet_req: "1",
    fb_dtsg: cookieStore.get("fb_dtsg")?.value || "",
    jazoest: "25664",
    lsd: cookieStore.get("lsd")?.value || "",
    __spin_r: "1015733964",
    __spin_b: "trunk",
    __spin_t: Date.now().toString(),
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "AdLibraryAdDetailsV2Query",
    variables: JSON.stringify(mergedVariables),
    server_timestamps: "true",
    doc_id: "8422900291076880",
  });

  try {
    const response = await fetch("https://www.facebook.com/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Origin: "https://www.facebook.com",
        Referer: "https://www.facebook.com/ads/library/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "X-FB-Friendly-Name": "AdLibraryAdDetailsV2Query",
        "X-FB-LSD": cookieStore.get("lsd")?.value || "",
        Cookie: cookieStore
          .getAll()
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; "),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Process the response to remove "for (;;);"
    const text = await response.text();
    const cleanedText = text.replace("for (;;);", "");

    // Parse the cleaned JSON string
    const data = JSON.parse(cleanedText);
    console.log("🚀🚀🚀🚀 ~ EU AD STATISTICS Data: ", data);

    return data;
  } catch (error) {
    console.error("Error fetching Ad Library details:", error);
    throw error; // Re-throw the error for the client to handle
  }
}
