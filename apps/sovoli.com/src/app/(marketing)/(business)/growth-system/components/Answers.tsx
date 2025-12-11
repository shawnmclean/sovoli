"use client";

import { useRef } from "react";
import type React from "react";
import posthog from "posthog-js";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import type { TrackingEventProperties } from "./Tracking";
import type { GrowthSystemContent } from "../content";

interface AnswersProps {
	content: GrowthSystemContent["answers"];
	trackingEventProperties?: TrackingEventProperties;
}

export function Answers({ content, trackingEventProperties }: AnswersProps) {
	const previousKeysRef = useRef<Set<string>>(new Set());

	const handleSelectionChange = (
		keys: Parameters<
			NonNullable<React.ComponentProps<typeof Accordion>["onSelectionChange"]>
		>[0],
	) => {
		const currentKeys =
			keys === "all"
				? new Set(content.faqs.map((_, i) => String(i)))
				: new Set(Array.from(keys as Set<unknown>).map(String));

		const newlyOpened = Array.from(currentKeys).filter(
			(key) => !previousKeysRef.current.has(key),
		);

		newlyOpened.forEach((key) => {
			const index = parseInt(key, 10);
			const faq = content.faqs[index];
			if (faq) {
				posthog.capture("SectionOpened", {
					content_name: faq.question,
					content_type: "faq",
					content_category: "FAQ",
					...trackingEventProperties,
				});
			}
		});

		previousKeysRef.current = currentKeys;
	};

	return (
		<section className="py-8 px-4 sm:py-16 bg-default-50">
			<div className="mx-auto max-w-4xl">
				<div className="text-center mb-8 sm:mb-12">
					<h2 className="text-2xl sm:text-3xl font-bold mb-4">
						{content.title}
					</h2>
					<p className="text-base sm:text-lg text-default-600 px-4">
						{content.subtitle}
					</p>
				</div>

				<div className="bg-background rounded-xl shadow-lg border border-default-200">
					<Accordion onSelectionChange={handleSelectionChange}>
						{content.faqs.map((faq, index) => (
							<AccordionItem key={String(index)} title={faq.question}>
								{faq.answer}
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}
