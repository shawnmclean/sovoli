import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import type { IndustryCardData } from "./components/IndustryCard";
import { IndustryCard } from "./components/IndustryCard";
import { DynamicHeadline } from "./components/DynamicHeadline";

export const metadata: Metadata = {
	title: "Sovoli Business – Digitize Your Organization",
	description:
		"Websites, Google visibility, programs, services, products, and projects — all in one place. Digital solutions for Caribbean businesses.",
};

const industries: IndustryCardData[] = [
	{
		id: "education",
		goal: "Increase Enrollment",
		description:
			"Turn parent searches into enrollment conversations. Get discovered on Google, build a professional website, and capture leads on WhatsApp.",
		href: "/growth-system",
		image:
			"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
		gradient: "from-blue-500 via-indigo-500 to-violet-500",
	},
	{
		id: "services",
		goal: "Get More Clients",
		description:
			"Showcase your expertise online. Get found by people searching for your services and convert visitors into paying clients.",
		href: "/services",
		image:
			"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
		gradient: "from-emerald-500 via-teal-500 to-cyan-500",
	},
	{
		id: "retail",
		goal: "Increase Sales",
		description:
			"Get your products in front of more buyers. Build an online storefront and reach customers beyond your physical location.",
		href: "/retail",
		image:
			"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
		gradient: "from-amber-500 via-orange-500 to-red-500",
	},
	{
		id: "farming",
		goal: "Reach More Buyers",
		description:
			"Connect directly with buyers looking for fresh produce. Showcase your farm and products to hotels, restaurants, and households.",
		href: "/farming",
		image:
			"https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
		gradient: "from-lime-500 via-green-500 to-emerald-500",
	},
	{
		id: "community",
		goal: "Grow Your Impact",
		description:
			"Increase visibility for your cause. Attract donors, volunteers, and community members who believe in your mission.",
		href: "/community",
		image:
			"https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
		gradient: "from-pink-500 via-rose-500 to-red-500",
	},
];

export default function BusinessPage() {
	return (
		<main className="min-h-screen">
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

				<div className="mx-auto max-w-6xl px-4 py-10 sm:py-16 md:py-20 lg:px-12 lg:py-24">
					<div className="flex flex-col md:flex-row md:items-start md:gap-8 lg:gap-12">
						{/* Text content */}
						<div className="md:flex-1">
							<DynamicHeadline />

							{/* Subheadline */}
							<p className="text-sm text-default-600 sm:text-base md:text-lg md:max-w-md lg:max-w-lg mb-6 sm:mb-8">
								Websites, Google visibility, programs, services, products, and
								projects — all in one place.
							</p>

							{/* CTA Button */}
							<Link
								href="/signup/business"
								className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-primary/90"
							>
								Get Started
							</Link>
						</div>

						{/* Hero image - mobile app mockup */}
						<div className="mt-10 md:mt-0 md:w-[180px] lg:w-[220px] xl:w-[260px] flex-shrink-0 self-center md:self-start">
							<div className="relative aspect-[9/16] w-[200px] mx-auto md:w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl ring-1 ring-black/5">
								<Image
									src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
									alt="Sovoli mobile app"
									fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Industries Grid */}
			<section className="mx-auto max-w-6xl px-4 pb-24">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
						What&apos;s Your Goal?
					</h2>
					<p className="mx-auto max-w-2xl text-default-500">
						Every business has a goal. We build digital systems tailored to help
						you achieve yours.
					</p>
				</div>

				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{industries.map((industry) => (
						<IndustryCard key={industry.id} industry={industry} />
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="border-t border-default-200 bg-default-50/50 dark:bg-default-50/5">
				<div className="mx-auto max-w-4xl px-4 py-16 text-center">
					<h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
						Ready to get started?
					</h2>
					<p className="mb-8 text-default-600">
						Set up your digital presence in minutes. No technical skills
						required.
					</p>
					<Link
						href="/signup/business"
						className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
					>
						Get Started
						<ArrowRightIcon className="h-5 w-5" />
					</Link>
				</div>
			</section>
		</main>
	);
}
