import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon } from "lucide-react";
import { getBusinessCategoryMeta } from "../categories";

export const metadata: Metadata = {
	title: "Bookstores – Sovoli Business",
	description:
		"Get discovered online, showcase your catalog, and turn customer searches into inquiries and sales.",
};

export default function BookstoreLandingPage() {
	const meta = getBusinessCategoryMeta("bookstore");

	return (
		<main className="min-h-screen pb-20 md:pb-0">
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background dark:from-primary-950/20" />
				</div>

				<div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:px-12 lg:py-20">
					<div className="mx-auto max-w-3xl text-center">
						<p className="mb-3 text-sm font-semibold text-default-500">
							Sovoli Business
						</p>
						<h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
							<span className="block text-foreground">{meta.heroTitle}</span>
						</h1>
						<p className="mx-auto mb-8 max-w-2xl text-lg text-default-600">
							{meta.heroSubtitle}
						</p>

						<div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link
								href="/business/bookstore/growth-system"
								className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-primary/90"
							>
								View Growth System
								<ArrowRightIcon className="h-5 w-5" />
							</Link>
							<Link
								href="/business"
								className="text-sm font-semibold text-primary"
							>
								Back to Business
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-4 pb-24 lg:px-12">
				<div className="rounded-2xl border border-default-200 bg-content1 p-6 sm:p-8">
					<h2 className="mb-2 text-xl font-semibold text-foreground">
						What you get
					</h2>
					<p className="text-default-600">
						The Growth System is tailored for {meta.label}. It helps you get
						discovered, convert visitors into conversations, and track
						performance over time.
					</p>
				</div>
			</section>
		</main>
	);
}
