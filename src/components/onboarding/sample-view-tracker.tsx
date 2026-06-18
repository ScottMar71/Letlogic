"use client";

import { useEffect } from "react";
import { markSampleViewed } from "@/components/onboarding/checklist";

export function SampleViewTracker() {
  useEffect(() => {
    markSampleViewed();
  }, []);
  return null;
}
