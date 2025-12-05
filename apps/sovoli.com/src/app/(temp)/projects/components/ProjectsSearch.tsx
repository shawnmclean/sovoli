"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import posthog from "posthog-js";
import { OrganizationAutocomplete } from "~/components/OrganizationAutocomplete";
import { ORGS } from "~/modules/data/organisations";

interface ProjectsSearchProps {
	selectedOrg?: string;
}

export function ProjectsSearch({ selectedOrg }: ProjectsSearchProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [inputValue, setInputValue] = useState("");
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleSelectionChange = (key: string | null) => {
		const params = new URLSearchParams(searchParams.toString());

		if (key) {
			params.set("org", key);
			// Reset to page 1 when filtering
			params.set("page", "1");
		} else {
			params.delete("org");
			params.delete("page");
		}

		const query = params.toString();

		// Track search event
		if (key) {
			// Get organization name from ORGS data (what was selected from autocomplete)
			const selectedOrgInstance = ORGS.find((org) => org.org.username === key);
			const orgName = selectedOrgInstance?.org.name ?? inputValue;

			posthog.capture("Search", {
				type: "project",
				search_string: orgName,
			});
		} else {
			// Track clear filter event
			posthog.capture("SearchCleared", {
				type: "project",
			});
		}

		router.replace(query ? `${pathname}?${query}` : pathname, {
			scroll: false,
		});
	};

	const handleClear = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("org");
		params.delete("page");

		const query = params.toString();

		// Track clear filter event
		posthog.capture("SearchCleared", { type: "project" });

		router.replace(query ? `${pathname}?${query}` : pathname, {
			scroll: false,
		});
	};

	const handleInputChange = (value: string) => {
		setInputValue(value);
	};

	const handleFocus = () => {
		posthog.capture("SearchInteract", {
			type: "project",
		});
	};

	// Debounced PostHog logging for input text changes
	// Only log when no item is selected and user has finished typing
	useEffect(() => {
		// Clear existing timeout
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		// Only log if:
		// 1. No item is currently selected (selectedOrg is null/undefined)
		// 2. There's actual input text (not empty)
		if (!selectedOrg && inputValue.trim()) {
			// Set a new timeout to log after user stops typing for 500ms
			debounceTimeoutRef.current = setTimeout(() => {
				posthog.capture("Search", {
					type: "project",
					search_string: inputValue,
				});
			}, 500);
		}

		// Cleanup timeout on unmount or when inputValue/selectedOrg changes
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, [inputValue, selectedOrg]);

	return (
		<div className="space-y-2">
			<OrganizationAutocomplete
				label="Search here"
				selectedKey={selectedOrg ?? null}
				onSelectionChange={handleSelectionChange}
				onInputChange={handleInputChange}
				onFocus={handleFocus}
				placeholder="School, farm, business, etc."
				countryCode="JM"
				className="w-full"
			/>
			{selectedOrg && (
				<button
					type="button"
					onClick={handleClear}
					className="text-sm text-primary hover:underline"
				>
					Clear filter
				</button>
			)}
		</div>
	);
}
