"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export interface TrackingEventProperties {
  content_name?: string;
  content_category?: string;
  content_type?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  predicted_ltv?: number;
}

interface TrackingProps {
  trackingEventProperties: TrackingEventProperties;
}

export function Tracking({ trackingEventProperties }: TrackingProps) {
  // Track initial load with defaults
  useEffect(() => {
    posthog.capture("ViewContent", trackingEventProperties);
  }, [trackingEventProperties]);

  return null; // This component doesn't render anything
}
