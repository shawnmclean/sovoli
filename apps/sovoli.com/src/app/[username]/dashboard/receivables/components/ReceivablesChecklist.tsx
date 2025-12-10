"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Media } from "~/modules/core/media/types";
import { filterVisualMedia } from "~/modules/core/media/types";
import type { OrgLocation } from "~/modules/organisations/types";

interface ReceivableItem {
	id: string;
	label: string;
	description?: string;
	hint?: string;
	status: "complete" | "partial" | "missing";
}

interface ReceivableCategory {
	id: string;
	title: string;
	description?: string;
	items: ReceivableItem[];
	isAccordion?: boolean;
	accordionGroups?: Array<{
		id: string;
		title: string;
		items: ReceivableItem[];
	}>;
}

interface ReceivablesChecklistProps {
	orgInstance: OrgInstance;
}

export function ReceivablesChecklist({
	orgInstance,
}: ReceivablesChecklistProps) {
	const { org, websiteModule, academicModule, workforceModule } = orgInstance;

	// Generate a unique storage key for this organization
	const storageKey = `receivables-checked-${org.username}`;

	// Load checked items from localStorage
	const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
		if (typeof window === "undefined") return new Set();
		try {
			const stored = localStorage.getItem(storageKey);
			if (!stored) return new Set();
			const parsed = JSON.parse(stored) as string[];
			return new Set(parsed);
		} catch {
			return new Set();
		}
	});

	// Save to localStorage whenever checkedItems changes
	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(
				storageKey,
				JSON.stringify(Array.from(checkedItems)),
			);
		} catch {
			// Ignore localStorage errors
		}
	}, [checkedItems, storageKey]);

	const toggleItem = (itemId: string) => {
		setCheckedItems((prev) => {
			const next = new Set(prev);
			if (next.has(itemId)) {
				next.delete(itemId);
			} else {
				next.add(itemId);
			}
			return next;
		});
	};

	// Helper to check if media exists and is visual
	const hasVisualMedia = (media?: Media[]): boolean => {
		if (!media || media.length === 0) return false;
		return filterVisualMedia(media).length > 0;
	};

	// Get primary location
	const primaryLocation = org.locations.find((loc) => loc.isPrimary);
	const firstLocation = org.locations[0];
	const location = primaryLocation ?? firstLocation;

	// Programs
	const programs = academicModule?.programs ?? [];
	const programCount = programs.length;

	// Workforce
	const workforceMembers = workforceModule?.members ?? [];

	// ===== ORGANIZATION BASICS =====
	const orgBasics: ReceivableItem[] = [
		{
			id: "logo",
			label: "Your Logo",
			description: "A logo image for your business (PNG or JPG)",
			hint: "This appears in the header of your website and on search results",
			status: org.logo ? "complete" : "missing",
		},
		{
			id: "business-name",
			label: "Business Name",
			description: "The official name of your organization",
			status: org.name ? "complete" : "missing",
		},
	];

	// Helper to check contacts
	const hasContactType = (
		loc: OrgLocation | undefined,
		...types: ("email" | "phone" | "whatsapp" | "other")[]
	): boolean => {
		if (!loc) return false;
		return loc.contacts.some((c) => types.includes(c.type));
	};

	// ===== LOCATION & CONTACT =====
	const locationItems: ReceivableItem[] = [
		{
			id: "street-address",
			label: "Street Address",
			description: "Where your business is located",
			hint: "e.g., '123 Main Street, Georgetown'",
			status: location?.address.line1 ? "complete" : "missing",
		},
		{
			id: "city",
			label: "City / Town",
			description: "The city or town where you're located",
			status: location?.address.city ? "complete" : "missing",
		},
		{
			id: "google-maps-link",
			label: "Google Maps Link",
			description: "Go to Google Maps, find your location, and share the link",
			hint: "This helps customers get directions to your business",
			status:
				location?.placeId || location?.coordinates ? "complete" : "missing",
		},
		{
			id: "phone-number",
			label: "Phone Number",
			description: "A phone number customers can call",
			status: hasContactType(location, "phone", "whatsapp")
				? "complete"
				: "missing",
		},
		{
			id: "whatsapp-number",
			label: "WhatsApp Number",
			description: "A WhatsApp number for inquiries (can be same as phone)",
			hint: "Most customers prefer WhatsApp for quick questions",
			status: hasContactType(location, "whatsapp") ? "complete" : "missing",
		},
		{
			id: "email-address",
			label: "Email Address",
			description: "An email for formal inquiries",
			status: hasContactType(location, "email") ? "complete" : "missing",
		},
	];

	// ===== PHOTOS OF YOUR LOCATION =====
	const locationPhotos: ReceivableItem[] = [
		{
			id: "exterior-photo",
			label: "Photo of Your Building (Outside)",
			description: "A clear photo of the front of your building",
			hint: "Helps customers recognize your location when they arrive",
			status: org.media?.some((m) => m.category === "environment")
				? "complete"
				: "missing",
		},
		{
			id: "classroom-photos",
			label: "Photos of Classrooms / Training Areas",
			description: "Show where students will learn",
			hint: "Clean, well-lit photos work best",
			status: org.media?.some((m) => m.category === "classroom")
				? "complete"
				: "missing",
		},
		{
			id: "general-photos",
			label: "Other Photos of Your Space",
			description: "Reception area, waiting room, equipment, etc.",
			status: hasVisualMedia(org.media) ? "complete" : "missing",
		},
	];

	// ===== WEBSITE HEADLINES =====
	const marketingContent: ReceivableItem[] = [
		{
			id: "main-headline",
			label: "Main Headline for Your Website",
			description: "A catchy headline that grabs attention",
			hint: "e.g., 'Learn Professional Massage Therapy in 8 Weeks'",
			status: websiteModule?.programsPageHero?.headline
				? "complete"
				: "missing",
		},
		{
			id: "tagline",
			label: "Short Description / Tagline",
			description: "1-2 sentences about what you offer",
			hint: "e.g., 'Hands-on training with certified instructors since 2010'",
			status: websiteModule?.programsPageHero?.subtext ? "complete" : "missing",
		},
		{
			id: "trust-statement",
			label: "Trust Statement",
			description: "Something that shows you're established and trusted",
			hint: "e.g., 'Trusted by 500+ graduates' or 'Serving families since 2015'",
			status:
				websiteModule?.programsPageHero?.socialProof ||
				websiteModule?.defaultSocialProof
					? "complete"
					: "missing",
		},
	];

	// ===== PROGRAMS (if they have any) =====
	const programItems: ReceivableItem[] = [];
	const programGroups: Array<{
		id: string;
		title: string;
		items: ReceivableItem[];
	}> = [];

	if (programCount === 0) {
		programItems.push({
			id: "program-list",
			label: "List of Programs / Courses You Offer",
			description: "What training or courses do you offer?",
			hint: "e.g., 'Massage Therapy Certificate', 'Beginner Sewing Course'",
			status: "missing",
		});
	} else {
		// For each program, check what's missing
		for (const [index, program] of programs.entries()) {
			const programName =
				program.name ??
				program.standardProgramVersion?.program.name ??
				`Program ${index + 1}`;
			const programPrefix = `program-${program.id}`;

			const hasName = Boolean(
				program.name ?? program.standardProgramVersion?.program.name,
			);
			const hasDescription = Boolean(program.description ?? program.tagline);
			const hasCycles = (program.cycles?.length ?? 0) > 0;
			const hasScheduleDates = program.cycles?.some(
				(c) => c.academicCycle.startDate ?? c.registrationPeriod?.startDate,
			);
			// pricingPackage is required on cycles, so just check if cycles exist
			const hasPricing = (program.cycles?.length ?? 0) > 0;
			const hasHighlights = (program.highlights?.length ?? 0) > 0;
			const hasAudience = Boolean(
				program.audience ?? (program.quickFacts?.length ?? 0) > 0,
			);

			const programGroupItems: ReceivableItem[] = [
				{
					id: `${programPrefix}-name`,
					label: "Name",
					description: "The name of this program",
					status: hasName ? "complete" : "missing",
				},
				{
					id: `${programPrefix}-description`,
					label: "Description",
					description: "What is this program about? What will students learn?",
					hint: "2-3 sentences explaining the program",
					status: hasDescription ? "complete" : "missing",
				},
				{
					id: `${programPrefix}-photos`,
					label: "Photos",
					description: "Photos of this program in action",
					hint: "Students learning, equipment used, finished projects, etc.",
					status: hasVisualMedia(program.media) ? "complete" : "missing",
				},
				{
					id: `${programPrefix}-duration`,
					label: "How Long Does It Take?",
					description: "Duration of the program",
					hint: "e.g., '8 weeks', '3 months', 'One semester'",
					status: hasCycles ? "complete" : "missing",
				},
				{
					id: `${programPrefix}-schedule`,
					label: "Schedule / Dates",
					description: "When does this program run?",
					hint: "Start date, end date, class days and times",
					status: hasScheduleDates ? "complete" : "missing",
				},
				{
					id: `${programPrefix}-price`,
					label: "Price / Fees",
					description: "How much does it cost to enroll?",
					hint: "Include any registration fees, materials, etc.",
					status: hasPricing ? "complete" : "missing",
				},
				{
					id: `${programPrefix}-highlights`,
					label: "Key Features / Benefits",
					description: "What makes this program special?",
					hint: "e.g., 'Small class sizes', 'Hands-on training', 'Certificate included'",
					status: hasHighlights ? "complete" : "missing",
				},
				{
					id: `${programPrefix}-audience`,
					label: "Who Is This For?",
					description: "Who should enroll in this program?",
					hint: "e.g., 'Beginners with no experience', 'Ages 18+'",
					status: hasAudience ? "complete" : "missing",
				},
			];

			// Add to both flat list (for backward compatibility) and grouped structure
			programItems.push(...programGroupItems);
			programGroups.push({
				id: programPrefix,
				title: programName,
				items: programGroupItems,
			});
		}
	}

	// ===== STAFF / TEACHERS =====
	const staffItems: ReceivableItem[] = [];

	if (workforceMembers.length === 0) {
		staffItems.push({
			id: "staff-list",
			label: "List of Teachers / Instructors",
			description: "Who teaches at your organization?",
			hint: "Name, photo, and a short bio for each person",
			status: "missing",
		});
	} else {
		for (const [index, member] of workforceMembers.entries()) {
			const memberPrefix = `staff-${member.id}`;
			const memberName = member.name || `Staff Member ${index + 1}`;

			const hasPhoto = Boolean(member.image);
			const hasBio = Boolean(member.bio);
			const hasEducation = (member.education?.length ?? 0) > 0;

			staffItems.push(
				{
					id: `${memberPrefix}-photo`,
					label: `${memberName}: Photo`,
					description: "A professional photo of this person",
					hint: "A clear headshot or professional photo",
					status: hasPhoto ? "complete" : "missing",
				},
				{
					id: `${memberPrefix}-bio`,
					label: `${memberName}: Short Bio`,
					description: "A few sentences about this person",
					hint: "Experience, qualifications, what they teach",
					status: hasBio ? "complete" : "missing",
				},
				{
					id: `${memberPrefix}-qualifications`,
					label: `${memberName}: Qualifications`,
					description: "Certifications, degrees, or experience",
					hint: "e.g., 'Certified Massage Therapist since 2010'",
					status: hasEducation ? "complete" : "missing",
				},
			);
		}
	}

	// ===== SOCIAL MEDIA =====
	const socialItems: ReceivableItem[] = [
		{
			id: "facebook",
			label: "Facebook Page Link",
			description: "Link to your Facebook business page",
			status: org.socialLinks?.some((s) => s.platform === "facebook")
				? "complete"
				: "missing",
		},
		{
			id: "instagram",
			label: "Instagram Link",
			description: "Link to your Instagram profile",
			status: org.socialLinks?.some((s) => s.platform === "instagram")
				? "complete"
				: "missing",
		},
	];

	const categories: ReceivableCategory[] = [
		{
			id: "basics",
			title: "Basic Info",
			description: "Your business name and logo",
			items: orgBasics,
		},
		{
			id: "location",
			title: "Location & Contact",
			description: "How customers can find and reach you",
			items: locationItems,
		},
		{
			id: "photos",
			title: "Photos of Your Space",
			description: "Show customers what your place looks like",
			items: locationPhotos,
		},
		{
			id: "marketing",
			title: "Website Headlines",
			description: "Text that appears on your website homepage",
			items: marketingContent,
		},
		{
			id: "programs",
			title:
				programCount > 0
					? `Your Programs / Courses (${programCount})`
					: "Your Programs / Courses",
			description: "Details about what you offer",
			items: programItems,
			isAccordion: programCount > 0,
			accordionGroups: programGroups,
		},
		{
			id: "staff",
			title:
				workforceMembers.length > 0
					? `Your Team (${workforceMembers.length})`
					: "Your Team",
			description: "Information about your teachers and staff",
			items: staffItems,
		},
		{
			id: "social",
			title: "Social Media (Optional)",
			description: "Links to your social media profiles",
			items: socialItems,
		},
	];

	const renderItem = (item: ReceivableItem, categoryId: string) => {
		const isChecked = checkedItems.has(item.id);
		const fullItemId = `${categoryId}-${item.id}`;

		return (
			<button
				type="button"
				key={item.id}
				className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer w-full text-left ${
					isChecked
						? "bg-success-50 border-success-200"
						: item.status === "complete"
							? "border-success-200 bg-success-50/30"
							: "border-default-200 hover:bg-default-50"
				}`}
				onClick={() => toggleItem(item.id)}
			>
				<div className="mt-0.5">
					<Checkbox
						id={fullItemId}
						isSelected={isChecked}
						onValueChange={() => toggleItem(item.id)}
						color="success"
					/>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<label
							htmlFor={fullItemId}
							className={`font-medium cursor-pointer ${
								isChecked ? "line-through text-default-400" : ""
							}`}
						>
							{item.label}
						</label>
						{item.status === "complete" && !isChecked && (
							<span className="text-xs px-2 py-0.5 rounded-full bg-success-100 text-success-700">
								✓ We have this
							</span>
						)}
					</div>
					{item.description && (
						<p
							className={`text-sm mt-1 ${
								isChecked ? "text-default-400" : "text-default-600"
							}`}
						>
							{item.description}
						</p>
					)}
					{item.hint && !isChecked && (
						<p className="text-xs text-default-400 mt-1 italic">
							💡 {item.hint}
						</p>
					)}
				</div>
			</button>
		);
	};

	return (
		<div className="space-y-6">
			{categories.map((category) => {
				const userCheckedCount = category.items.filter((item) =>
					checkedItems.has(item.id),
				).length;
				const totalCount = category.items.length;

				return (
					<Card key={category.id}>
						<CardHeader>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-3 mb-1">
										<h2 className="text-lg font-semibold">{category.title}</h2>
										<div className="text-sm font-medium text-default-600">
											{userCheckedCount} / {totalCount}
										</div>
									</div>
									{category.description && (
										<p className="text-sm text-default-500">
											{category.description}
										</p>
									)}
								</div>
							</div>
						</CardHeader>
						<CardBody>
							{category.isAccordion && category.accordionGroups ? (
								<Accordion variant="bordered" selectionMode="multiple">
									{category.accordionGroups.map((group) => {
										const groupCheckedCount = group.items.filter((item) =>
											checkedItems.has(item.id),
										).length;
										const groupTotalCount = group.items.length;

										return (
											<AccordionItem
												key={group.id}
												title={
													<div className="flex items-center justify-between w-full pr-4">
														<span className="font-medium">{group.title}</span>
														<span className="text-sm text-default-500">
															{groupCheckedCount} / {groupTotalCount}
														</span>
													</div>
												}
											>
												<div className="space-y-3 pt-2">
													{group.items.map((item) =>
														renderItem(item, category.id),
													)}
												</div>
											</AccordionItem>
										);
									})}
								</Accordion>
							) : (
								<div className="space-y-3">
									{category.items.map((item) => renderItem(item, category.id))}
								</div>
							)}
						</CardBody>
					</Card>
				);
			})}
		</div>
	);
}
