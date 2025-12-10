"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { OrgInstance } from "~/modules/organisations/types";
import { Avatar } from "@sovoli/ui/components/avatar";
import { BadgeCheckIcon, GiftIcon, AwardIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";
import { Badge } from "@sovoli/ui/components/badge";

interface OrgHighlightsSectionProps {
	orgInstance: OrgInstance;
	program: Program;
}

export function OrgHighlightsSection({
	orgInstance,
	program,
}: OrgHighlightsSectionProps) {
	const org = orgInstance.org;

	// Only show highlights for magy or fitright
	const shouldShowHighlights =
		org.username === "magy" || org.username === "fitright";

	const highlights = useMemo(() => {
		if (!shouldShowHighlights) return [];

		return [
			{
				title: "Award-Winning",
				description:
					org.username === "magy"
						? "Acknowledged by the Ministry of Education"
						: "Acknowledged by the Ministry of Education",
				icon: <AwardIcon size={16} className="text-yellow-500" />,
			},
			{
				title: "Community Sponsorship",
				description:
					org.username === "magy"
						? "15+ books donated by FitRight Academy"
						: "15+ books donated to Modern Academy",
				icon: <GiftIcon size={16} className="text-pink-500" />,
			},
		];
	}, [org.username, shouldShowHighlights]);

	return (
		<Link
			href={`/programs/${program.slug}/org-highlights`}
			className="block my-6 border-b border-default-200 pb-6"
		>
			<section className="overflow-hidden">
				<div className="pb-4">
					<h2 className="text-xl font-bold text-foreground flex items-center gap-2">
						Your School
					</h2>
				</div>

				<div className="space-y-4">
					{/* School Identity */}
					<div className="flex flex-col items-center gap-4">
						<Badge
							isOneChar
							color="success"
							content={<BadgeCheckIcon size={16} className="text-white" />}
							placement="bottom-right"
							shape="circle"
						>
							<Avatar
								src={org.logo}
								name={org.name}
								size="lg"
								fallback={
									<span className="text-xs text-default-500">
										Logo Not Available
									</span>
								}
							/>
						</Badge>
						<div className="text-center">
							<h2 className="font-bold text-lg flex items-center justify-center gap-2">
								{org.name}
							</h2>
						</div>
					</div>

					{/* School Highlights List - Only show if highlights exist */}
					{highlights.length > 0 && (
						<>
							<div className="space-y-2">
								{highlights.map((h, i) => (
									<div key={i} className="flex items-start gap-3">
										<div className="pt-1">{h.icon}</div>
										<div>
											<div className="text-sm font-semibold">{h.title}</div>
											<div className="text-xs text-muted-foreground">
												{h.description}
											</div>
										</div>
									</div>
								))}
							</div>

							<div className="mt-3 underline text-muted-foreground">
								Learn More
							</div>
						</>
					)}
				</div>
			</section>
		</Link>
	);
}
