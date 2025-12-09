"use client";

import { useRef } from "react";
import type React from "react";
import posthog from "posthog-js";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import type { TrackingEventProperties } from "./Tracking";

const faqs = [
	{
		question: "Can I test the system before committing to the full setup?",
		answer: (
			<>
				Yes. We can set up your website with a single program and run ads for
				that program so you can see how the lead-generation system works in real
				time.
				<br />
				<br />
				You only pay for the ad management and advertising budget during this
				test. When you're ready, we can expand the full system with all programs
				and features.
			</>
		),
	},
	{
		question: "Do I own my website, domain, and content?",
		answer: (
			<>
				Yes. You fully own your domain and everything you publish—text, images,
				programs, services, and branding.
				<br />
				<br />
				Sovoli provides the platform that powers the site, but your content and
				domain always remain yours and can be moved to another developer or
				platform at any time.
			</>
		),
	},
	{
		question: "What happens if I don’t renew?",
		answer: (
			<>
				Your website does not disappear. Your Sovoli subdomain and all of your
				content remain online, and your directory listings stay active.
				<br />
				<br />
				The only thing that goes offline is your custom domain (e.g.,
				yourschool.com) and the Growth System engine—ads, funnels, analytics,
				and the automated customer-generation features.
				<br />
				<br />
				Your content is always yours and can be exported or rebuilt anywhere you
				choose.
			</>
		),
	},
	{
		question: "Can another designer work on my website?",
		answer: (
			<>
				Yes. Any designer you choose can update your pages and content through
				the Sovoli dashboard.
				<br />
				<br />
				Because the platform is open code, designers can also make deeper
				improvements as long as they are reviewed and approved by our team to
				keep everything secure and stable.
			</>
		),
	},
	{
		question: "How long does setup take?",
		answer: (
			<>
				Setup is iterative. Once you send the content for your first program, we
				can publish an initial version and start generating value within{" "}
				<strong>5 hours</strong>.
				<br />
				<br />
				We continue improving the site as we receive more content—updating
				pages, testing messaging, refining layouts, and adjusting the funnel
				until everything performs well.
				<br />
				<br />
				To see real results quickly, we recommend pairing the setup with an
				initial <strong>$50 ad-spend</strong> so you can watch the system bring
				in leads immediately.
				<br />
				<br />A fully polished setup typically completes within{" "}
				<strong>5–7 days</strong>, but you begin seeing meaningful activity
				almost right away.
			</>
		),
	},
	{
		question: "How does payment work?",
		answer: (
			<>
				The subscription is billed annually and covers hosting, maintenance,
				platform updates, analytics, directory integration, and support.
				<br />
				<br />
				Payment plans are available if you prefer not to pay annually all at
				once.
				<br />
				<br />
				Ad-spend for campaigns must be paid upfront before ads are launched.
			</>
		),
	},
];

interface AnswersProps {
	trackingEventProperties?: TrackingEventProperties;
}

export function Answers({ trackingEventProperties }: AnswersProps) {
	const previousKeysRef = useRef<Set<string>>(new Set());

	const handleSelectionChange = (
		keys: Parameters<
			NonNullable<React.ComponentProps<typeof Accordion>["onSelectionChange"]>
		>[0],
	) => {
		const currentKeys =
			keys === "all"
				? new Set(faqs.map((_, i) => String(i)))
				: new Set(Array.from(keys as Set<unknown>).map(String));

		const newlyOpened = Array.from(currentKeys).filter(
			(key) => !previousKeysRef.current.has(key),
		);

		newlyOpened.forEach((key) => {
			const index = parseInt(key, 10);
			const faq = faqs[index];
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
						Frequently Asked Questions
					</h2>
					<p className="text-base sm:text-lg text-default-600 px-4">
						Everything you need to know about the Growth System and how it can
						help your school grow.
					</p>
				</div>

				<div className="bg-background rounded-xl shadow-lg border border-default-200">
					<Accordion onSelectionChange={handleSelectionChange}>
						{faqs.map((faq, index) => (
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
