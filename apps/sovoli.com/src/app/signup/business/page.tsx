import Link from "next/link";
import { ArrowRightIcon, BuildingIcon } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "~/components/footer/Footer";
import { MarketingNavbar } from "../../(marketing)/components/navbar/MarketingNavbar";

export const metadata: Metadata = {
	title: "Set Up Your Sovoli Business",
	description:
		"Tell us about your business and we'll configure your digital presence. Get started in minutes.",
};

const businessCategoryLabels: Record<string, string> = {
	k12: "K-12",
	"skills-training": "Skills Training",
	bookstore: "Bookstore",
};

interface Props {
	searchParams: Promise<{ category?: string }>;
}

export default async function SignupBusinessPage({ searchParams }: Props) {
	const { category } = await searchParams;
	const categoryLabel = category ? businessCategoryLabels[category] : null;

	return (
		<div className="flex min-h-screen flex-col">
			<MarketingNavbar />

			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative overflow-hidden">
					{/* Background pattern */}
					<div className="absolute inset-0 -z-10">
						<div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background dark:from-primary-950/20" />
						<div
							className="absolute inset-0 opacity-[0.03]"
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
							}}
						/>
					</div>

					<div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
						{/* Business category tag */}
						{categoryLabel && (
							<div className="mb-6 flex justify-center">
								<span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
									<BuildingIcon className="h-4 w-4" />
									Business type: {categoryLabel}
								</span>
							</div>
						)}

						{/* Main headline */}
						<h1 className="mb-6 text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
							<span className="block text-foreground">Set Up Your</span>
							<span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
								Sovoli Business
							</span>
						</h1>

						{/* Subheadline */}
						<p className="mx-auto mb-8 max-w-xl text-center text-lg text-default-600">
							Tell us about your business and we&apos;ll configure your digital
							presence.
						</p>

						{/* Intro text */}
						<div className="mb-12 rounded-2xl border border-default-200 bg-content1 p-6 text-center">
							<p className="text-default-600">
								We&apos;ll ask a few questions to get your digital system
								started. This takes about 5 minutes.
							</p>
						</div>

						{/* CTA */}
						<div className="flex justify-center">
							<Link
								href="/signup/business/details"
								className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
							>
								Continue
								<ArrowRightIcon className="h-5 w-5" />
							</Link>
						</div>
					</div>
				</section>

				{/* Placeholder for future form/steps */}
				<section className="mx-auto max-w-3xl px-4 pb-24">
					<div className="rounded-2xl border-2 border-dashed border-default-200 bg-default-50/50 p-12 text-center dark:bg-default-50/5">
						<p className="text-default-400">
							Form and setup steps will appear here
						</p>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
