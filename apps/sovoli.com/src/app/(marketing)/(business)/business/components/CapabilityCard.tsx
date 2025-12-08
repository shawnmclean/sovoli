import { LucideIcon } from "lucide-react";

export interface CapabilityCardData {
	title: string;
	description: string;
	icon: LucideIcon;
}

export function CapabilityCard({
	capability,
}: {
	capability: CapabilityCardData;
}) {
	const Icon = capability.icon;

	return (
		<div className="rounded-xl border border-default-200 bg-background p-6 shadow-sm transition-all hover:shadow-md dark:border-default-800">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
				<Icon className="h-6 w-6" />
			</div>
			<h3 className="mb-3 text-xl font-semibold text-foreground">
				{capability.title}
			</h3>
			<p className="text-default-600">{capability.description}</p>
		</div>
	);
}
