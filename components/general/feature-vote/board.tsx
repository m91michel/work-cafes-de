
'use client'

import Script from "next/script";
import { useId } from "react";

const TARGET_CONTAINER_ID = "roadmap-component";

export const RoadmapComponent = () => {
  const sessionKey = useId();

  return (
    <>
      <Script
        key={sessionKey}
        src={`https://features.vote/widget/widget.js?sessionKey=${sessionKey}`}
        onLoad={() => {
          // @ts-ignore
          window.loadRoadmap(TARGET_CONTAINER_ID);
        }}
        // @ts-ignore
        color_mode="light"  // or dark
        user_spend={0}
        slug="awifiplace"
      />

      <div id={TARGET_CONTAINER_ID}></div>
    </>
  );
}