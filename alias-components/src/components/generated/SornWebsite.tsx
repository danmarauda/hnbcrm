import React from "react";
import { NoiseOverlay } from "./NoiseOverlay";
import { PortfolioGrid } from "./PortfolioGrid";
import { ProcessSection } from "./ProcessSection";
import { MeetingFeaturesSection } from "./MeetingFeaturesSection";

// @component: SornWebsite
export const SornWebsite = () => {
  return <div className="min-h-screen bg-[#080808] text-neutral-200 font-sans selection:bg-white/20 selection:text-white overflow-x-hidden">
      <NoiseOverlay />
      <PortfolioGrid />
      <ProcessSection />
      <MeetingFeaturesSection />
    </div>;
};
export default SornWebsite;