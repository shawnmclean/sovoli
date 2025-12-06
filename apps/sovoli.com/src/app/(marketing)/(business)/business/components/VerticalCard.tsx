"use client";

import Link from "next/link";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

export interface Vertical {
	id: string;
	name: string;
	tagline: string;
	description: string;
	href: string;
	icon: React.ReactNode;
	gradient: string;
	accentColor: string;
	features: string[];
	status: "live" | "coming-soon";
}

export function VerticalCard({ vertical }: { vertical: Vertical }) {
	const isLive = vertical.status === "live";

	return (
		<Link
			href={vertical.href}
			className={`group relative block overflow-hidden rounded-2xl border border-default-200 bg-content1 transition-all duration-300 ${
				isLive
					? "hover:border-transparent hover:shadow-2xl hover:-translate-y-1"
					: "cursor-not-allowed opacity-70"
			}`}
			aria-disabled={!isLive}
			onClick={(e) => !isLive && e.preventDefault()}
		>
			{/* Gradient overlay on hover */}
			<div
				className={`absolute inset-0 bg-gradient-to-br ${vertical.gradient} opacity-0 transition-opacity duration-300 ${
					isLive ? "group-hover:opacity-5" : ""
				}`}
			/>

			{/* Status badge */}
			{!isLive && (
				<div className="absolute top-4 right-4 z-10">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-default-100 px-3 py-1 text-xs font-medium text-default-600">
						<SparklesIcon className="h-3 w-3" />
						Coming Soon
					</span>
				</div>
			)}

			<div className="relative p-6 sm:p-8">
				{/* Icon with gradient background */}
				<div
					className={`mb-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${vertical.gradient} p-3 text-white shadow-lg`}
				>
					{vertical.icon}
				</div>

				{/* Content */}
				<h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
					{vertical.name}
				</h3>
				<p
					className={`mb-3 text-sm font-semibold bg-gradient-to-r ${vertical.gradient} bg-clip-text text-transparent`}
				>
					{vertical.tagline}
				</p>
				<p className="mb-6 text-default-500 leading-relaxed">
					{vertical.description}
				</p>

				{/* Features list */}
				<ul className="mb-6 space-y-2">
					{vertical.features.map((feature) => (
						<li key={feature} className="flex items-center gap-2 text-sm">
							<ZapIcon
								className={`h-4 w-4 flex-shrink-0 ${
									isLive ? "text-success" : "text-default-400"
								}`}
							/>
							<span className="text-default-600">{feature}</span>
						</li>
					))}
				</ul>

				{/* CTA */}
				<div
					className={`flex items-center gap-2 font-semibold transition-colors ${
						isLive
							? `text-${vertical.accentColor}-500 group-hover:text-${vertical.accentColor}-600`
							: "text-default-400"
					}`}
				>
					<span>{isLive ? "Explore" : "Notify me"}</span>
					<ArrowRightIcon
						className={`h-4 w-4 transition-transform ${
							isLive ? "group-hover:translate-x-1" : ""
						}`}
					/>
				</div>
			</div>

			{/* Bottom gradient line */}
			<div
				className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${vertical.gradient} ${
					isLive ? "opacity-0 group-hover:opacity-100" : "opacity-30"
				} transition-opacity duration-300`}
			/>
		</Link>
	);
}
