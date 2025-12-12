import type { Metadata } from "next";
import { headers } from "next/headers";
import { detectCurrency } from "~/utils/currencyDetection";
import { getContent } from "../_growth-system/content";
import { Answers } from "../_growth-system/components/Answers";
import { CTA } from "../_growth-system/components/CTA";
import { Customers } from "../_growth-system/components/Customers";
import { Features } from "../_growth-system/components/Features";
import { Overview } from "../_growth-system/components/Overview";
import { Pricing } from "../_growth-system/components/Pricing";
import { Tracking } from "../_growth-system/components/Tracking";
import type { TrackingEventProperties } from "../_growth-system/components/Tracking";

const content = getContent("skills-training");

export const metadata: Metadata = {
        title: content.metadata.title,
        description: content.metadata.description,
};

export default async function SkillsTrainingGrowthSystemPage() {
        const headersList = await headers();
        const preferredCurrency = detectCurrency(headersList);
        const trackingProperties: TrackingEventProperties =
                content.tracking as TrackingEventProperties;

        return (
                <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
                        <Tracking trackingEventProperties={trackingProperties} />
                        <Overview content={content.overview} />
                        <Customers content={content.customers} />
                        <Features content={content.features} />
                        <Pricing preferredCurrency={preferredCurrency} />
                        <Answers
                                content={content.answers}
                                trackingEventProperties={trackingProperties}
                        />
                        <CTA content={content.cta} trackingEventProperties={trackingProperties} />
                </div>
        );
}
