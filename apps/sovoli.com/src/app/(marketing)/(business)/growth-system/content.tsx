import type React from "react";
import type { StaticImageData } from "next/image";
import bingResultImage from "./components/bing-result.png";
import googleResultImage from "./components/google-maps.png";
import sovoliDirectoryImage from "./components/sovoli-directory.png";

export type Category = "k12" | "skills-training" | "bookstore";

interface Screenshot {
	image: StaticImageData;
	footnote?: string;
}

export type IconName = "search" | "target" | "globe" | "message-circle";

interface Feature {
	title: string;
	icon: IconName;
	headline: string;
	description: string;
	features: string[];
	screenshots?: Screenshot[];
	nextFeature?: string;
}

interface Customer {
	company: string;
	title: string;
	quote: string;
	caseStudyLink: string;
	logo: string;
}

interface FAQ {
	question: string;
	answer: React.ReactNode;
}

export interface GrowthSystemContent {
	metadata: {
		title: string;
		description: string;
	};
	overview: {
		productName: string;
		title: string;
		description: React.ReactNode;
	};
	customers: {
		title: string;
		customers: Customer[];
	};
	features: {
		title: string;
		features: Record<string, Feature>;
	};
	pricing: {
		title: string;
	};
	answers: {
		title: string;
		subtitle: string;
		faqs: FAQ[];
	};
	cta: {
		title: string;
		description: string;
		message: string;
	};
	tracking: {
		content_name: string;
		content_type: string;
		content_ids: string[];
		value: number;
		currency: string;
		predicted_ltv: number;
		audience: "school-admin" | "parent" | "business-owner";
	};
}

const k12Content: GrowthSystemContent = {
	metadata: {
		title: "Growth System for K-12 Schools – Sovoli",
		description:
			"A complete digital visibility and lead system built for small private schools in Guyana. Turn parent searches into enrollment conversations automatically.",
	},
	overview: {
		productName: "Growth System",
		title: "Grow Your School With Digital Marketing Systems",
		description: (
			<>
				Sovoli is the only data-driven growth enrollment system built
				specifically for private schools in <strong>Guyana</strong> and{" "}
				<strong>Jamaica</strong>.
			</>
		),
	},
	customers: {
		title: "Schools Already Growing With Sovoli",
		customers: [
			{
				company: "Modern Academy",
				title: "Increased calls by 300%",
				quote:
					"We were getting 2 calls per week from ads, now we're getting 6-8 calls per week without ads.",
				caseStudyLink: "https://www.ma.edu.gy?ref=sovoli-case-study",
				logo: "/images/orgs/private-schools/guyana/modernacademy/logo.webp",
			},
			{
				company: "Fit Right Academy",
				title: "Got our first few students",
				quote: "Found the right students for our program.",
				caseStudyLink: "https://www.fitright.gy?ref=sovoli-case-study",
				logo: "/images/orgs/vocational-training/guyana/fitright/logo.webp",
			},
		],
	},
	features: {
		title: "Features",
		features: {
			discovery: {
				title: "Discovery",
				icon: "search",
				headline: "Parents are searching.",
				description:
					"A mother opens her phone and types 'best schools near me.' Your school appears at the top.",
				features: [
					"Show up when parents search online",
					"Appear on Google and Bing maps",
					"Be listed in trusted school directories",
				],
				screenshots: [
					{
						image: bingResultImage,
						footnote: "We rank on the first pages of Google and Bing.",
					},
					{
						image: googleResultImage,
						footnote: "Fully fleshed out Maps listing to show up for more parents.",
					},
					{
						image: sovoliDirectoryImage,
						footnote: "Rank up in our directory with over 500+ monthly visitors.",
					},
				],
				nextFeature: "ads",
			},
			ads: {
				title: "Ads",
				icon: "target",
				headline: "Intelligent Advertising",
				description:
					"A mother nearby is scrolling through Facebook when she sees your ad. We put even more families in front of your school.",
				features: [
					"We run and manage Facebook + Instagram ads for you.",
					"Target the right parents in your local area automatically",
					"Ad performance reports (how much did you spend? how many leads did you get? how much did you earn?)",
				],
				nextFeature: "diagnostics",
			},
			diagnostics: {
				title: "Website",
				icon: "globe",
				headline: "Professional Website Built for Mobile",
				description:
					"Majority of parents are using mobile devices to search for schools, so we build a website that works perfectly on mobile.",
				features: [
					"Program Finder page to showcase your programs",
					"Comprehensive program details page",
					"School Calendar to showcase your events and activities",
					"AI Chatbot to answer parent questions",
					"Enrollment and schedule visitation flows",
				],
				nextFeature: "leadCapture",
			},
			leadCapture: {
				title: "WhatsApp",
				icon: "message-circle",
				headline: "Convert Visitors Into Conversations",
				description:
					"Guyanese parents prefer to communicate via WhatsApp. So we send high quality leads to your WhatsApp number.",
				features: ["One-click WhatsApp chat", "Follow-up reminders"],
			},
		},
	},
	pricing: {
		title: "Pricing",
	},
	answers: {
		title: "Frequently Asked Questions",
		subtitle:
			"Everything you need to know about the Growth System and how it can help your school grow.",
		faqs: [
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
				question: "What happens if I don't renew?",
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
		],
	},
	cta: {
		title: "Ready to Grow Your School?",
		description:
			"Get started today and start converting parent searches into enrollment conversations.",
		message: "I would like more information on your growth system",
	},
	tracking: {
		content_name: "Growth System",
		content_type: "product",
		content_ids: ["growth-system"],
		value: 80000,
		currency: "GYD",
		predicted_ltv: 1200000,
		audience: "school-admin",
	},
};

const skillsTrainingContent: GrowthSystemContent = {
	metadata: {
		title: "Growth System for Skills Training – Sovoli",
		description:
			"A complete digital visibility and lead system built for skills training centers. Turn student searches into enrollment conversations automatically.",
	},
	overview: {
		productName: "Growth System",
		title: "Grow Your Training Center With Digital Marketing Systems",
		description: (
			<>
				Sovoli is the only data-driven growth enrollment system built
				specifically for skills training centers in <strong>Guyana</strong> and{" "}
				<strong>Jamaica</strong>.
			</>
		),
	},
	customers: {
		title: "Training Centers Already Growing With Sovoli",
		customers: [
			{
				company: "Fit Right Academy",
				title: "Got our first few students",
				quote: "Found the right students for our program.",
				caseStudyLink: "https://www.fitright.gy?ref=sovoli-case-study",
				logo: "/images/orgs/vocational-training/guyana/fitright/logo.webp",
			},
		],
	},
	features: {
		title: "Features",
		features: {
			discovery: {
				title: "Discovery",
				icon: "search",
				headline: "Students are searching.",
				description:
					"A student opens their phone and types 'best training programs near me.' Your training center appears at the top.",
				features: [
					"Show up when students search online",
					"Appear on Google and Bing maps",
					"Be listed in trusted training directories",
				],
				screenshots: [
					{
						image: bingResultImage,
						footnote: "We rank on the first pages of Google and Bing.",
					},
					{
						image: googleResultImage,
						footnote: "Fully fleshed out Maps listing to show up for more students.",
					},
					{
						image: sovoliDirectoryImage,
						footnote: "Rank up in our directory with over 500+ monthly visitors.",
					},
				],
				nextFeature: "ads",
			},
			ads: {
				title: "Ads",
				icon: "target",
				headline: "Intelligent Advertising",
				description:
					"A student nearby is scrolling through Facebook when they see your ad. We put even more potential students in front of your training center.",
				features: [
					"We run and manage Facebook + Instagram ads for you.",
					"Target the right students in your local area automatically",
					"Ad performance reports (how much did you spend? how many leads did you get? how much did you earn?)",
				],
				nextFeature: "diagnostics",
			},
			diagnostics: {
				title: "Website",
				icon: "globe",
				headline: "Professional Website Built for Mobile",
				description:
					"Majority of students are using mobile devices to search for training programs, so we build a website that works perfectly on mobile.",
				features: [
					"Program Finder page to showcase your training programs",
					"Comprehensive program details page",
					"Training Calendar to showcase your classes and schedules",
					"AI Chatbot to answer student questions",
					"Enrollment and schedule consultation flows",
				],
				nextFeature: "leadCapture",
			},
			leadCapture: {
				title: "WhatsApp",
				icon: "message-circle",
				headline: "Convert Visitors Into Conversations",
				description:
					"Caribbean students prefer to communicate via WhatsApp. So we send high quality leads to your WhatsApp number.",
				features: ["One-click WhatsApp chat", "Follow-up reminders"],
			},
		},
	},
	pricing: {
		title: "Pricing",
	},
	answers: {
		title: "Frequently Asked Questions",
		subtitle:
			"Everything you need to know about the Growth System and how it can help your training center grow.",
		faqs: [
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
				question: "What happens if I don't renew?",
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
		],
	},
	cta: {
		title: "Ready to Grow Your Training Center?",
		description:
			"Get started today and start converting student searches into enrollment conversations.",
		message: "I would like more information on your growth system for training centers",
	},
	tracking: {
		content_name: "Growth System - Skills Training",
		content_type: "product",
		content_ids: ["growth-system", "skills-training"],
		value: 80000,
		currency: "GYD",
		predicted_ltv: 1200000,
		audience: "business-owner",
	},
};

const bookstoreContent: GrowthSystemContent = {
	metadata: {
		title: "Growth System for Bookstores – Sovoli",
		description:
			"A complete digital visibility and lead system built for bookstores. Turn customer searches into sales conversations automatically.",
	},
	overview: {
		productName: "Growth System",
		title: "Grow Your Bookstore With Digital Marketing Systems",
		description: (
			<>
				Sovoli is the only data-driven growth system built specifically for
				bookstores in <strong>Guyana</strong> and <strong>Jamaica</strong>.
			</>
		),
	},
	customers: {
		title: "Bookstores Already Growing With Sovoli",
		customers: [],
	},
	features: {
		title: "Features",
		features: {
			discovery: {
				title: "Discovery",
				icon: "search",
				headline: "Customers are searching.",
				description:
					"A customer opens their phone and types 'bookstore near me' or 'textbooks for sale.' Your bookstore appears at the top.",
				features: [
					"Show up when customers search online",
					"Appear on Google and Bing maps",
					"Be listed in trusted business directories",
				],
				screenshots: [
					{
						image: bingResultImage,
						footnote: "We rank on the first pages of Google and Bing.",
					},
					{
						image: googleResultImage,
						footnote: "Fully fleshed out Maps listing to show up for more customers.",
					},
					{
						image: sovoliDirectoryImage,
						footnote: "Rank up in our directory with over 500+ monthly visitors.",
					},
				],
				nextFeature: "ads",
			},
			ads: {
				title: "Ads",
				icon: "target",
				headline: "Intelligent Advertising",
				description:
					"A customer nearby is scrolling through Facebook when they see your ad. We put even more potential customers in front of your bookstore.",
				features: [
					"We run and manage Facebook + Instagram ads for you.",
					"Target the right customers in your local area automatically",
					"Ad performance reports (how much did you spend? how many leads did you get? how much did you earn?)",
				],
				nextFeature: "diagnostics",
			},
			diagnostics: {
				title: "Website",
				icon: "globe",
				headline: "Professional Website Built for Mobile",
				description:
					"Majority of customers are using mobile devices to search for books, so we build a website that works perfectly on mobile.",
				features: [
					"Product catalog page to showcase your books",
					"Comprehensive product details page",
					"Store Calendar to showcase your events and promotions",
					"AI Chatbot to answer customer questions",
					"Order and inquiry flows",
				],
				nextFeature: "leadCapture",
			},
			leadCapture: {
				title: "WhatsApp",
				icon: "message-circle",
				headline: "Convert Visitors Into Conversations",
				description:
					"Caribbean customers prefer to communicate via WhatsApp. So we send high quality leads to your WhatsApp number.",
				features: ["One-click WhatsApp chat", "Follow-up reminders"],
			},
		},
	},
	pricing: {
		title: "Pricing",
	},
	answers: {
		title: "Frequently Asked Questions",
		subtitle:
			"Everything you need to know about the Growth System and how it can help your bookstore grow.",
		faqs: [
			{
				question: "Can I test the system before committing to the full setup?",
				answer: (
					<>
						Yes. We can set up your website with a single product category and run ads
						for that category so you can see how the lead-generation system works in
						real time.
						<br />
						<br />
						You only pay for the ad management and advertising budget during this
						test. When you're ready, we can expand the full system with all products
						and features.
					</>
				),
			},
			{
				question: "Do I own my website, domain, and content?",
				answer: (
					<>
						Yes. You fully own your domain and everything you publish—text, images,
						products, services, and branding.
						<br />
						<br />
						Sovoli provides the platform that powers the site, but your content and
						domain always remain yours and can be moved to another developer or
						platform at any time.
					</>
				),
			},
			{
				question: "What happens if I don't renew?",
				answer: (
					<>
						Your website does not disappear. Your Sovoli subdomain and all of your
						content remain online, and your directory listings stay active.
						<br />
						<br />
						The only thing that goes offline is your custom domain (e.g.,
						yourbookstore.com) and the Growth System engine—ads, funnels, analytics,
						and the automated customer-generation features.
						<br />
						<br />
						Your content is always yours and can be exported or rebuilt anywhere you
						choose.
					</>
				),
			},
			{
				question: "How long does setup take?",
				answer: (
					<>
						Setup is iterative. Once you send the content for your first product
						category, we can publish an initial version and start generating value
						within <strong>5 hours</strong>.
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
		],
	},
	cta: {
		title: "Ready to Grow Your Bookstore?",
		description:
			"Get started today and start converting customer searches into sales conversations.",
		message: "I would like more information on your growth system for bookstores",
	},
	tracking: {
		content_name: "Growth System - Bookstore",
		content_type: "product",
		content_ids: ["growth-system", "bookstore"],
		value: 80000,
		currency: "GYD",
		predicted_ltv: 1200000,
		audience: "business-owner",
	},
};

export const contentByCategory: Record<Category, GrowthSystemContent> = {
	k12: k12Content,
	"skills-training": skillsTrainingContent,
	bookstore: bookstoreContent,
};

export function getContent(category: Category): GrowthSystemContent {
	return contentByCategory[category];
}

