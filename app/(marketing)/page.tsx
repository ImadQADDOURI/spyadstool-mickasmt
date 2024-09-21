import { Suspense } from "react";

import { infos } from "@/config/landing";
import AdsLibrary from "@/components/adsLibrary/AdsLibrary";
import FacebookAdsComponent from "@/components/adsLibrary/facebookApiTest";
import { BentoGrid } from "@/components/sections/bentogrid";
import { Features } from "@/components/sections/features";
import { HeroLanding } from "@/components/sections/hero-landing";
import { InfoLanding } from "@/components/sections/info-landing";
import { Powered } from "@/components/sections/powered";
import { PreviewLanding } from "@/components/sections/preview-landing";
import { Testimonials } from "@/components/sections/testimonials";

import AdLibraryPage from "../(dashboard)/dashboard/ad-library/page";

export default async function IndexPage() {
  return (
    <>
      <HeroLanding />
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">
          Facebook Api Test, Ads Search
        </h1>
        <FacebookAdsComponent />
      </div>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AdsLibrary />
        </Suspense>
      </div>
      <PreviewLanding />
      <Powered />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      {/* <InfoLanding data={infos[1]} /> */}
      <Features />
      <Testimonials />
    </>
  );
}
