"use client";

import { usePathname } from "next/navigation";
import {
	Navbar,
	NavbarContent,
	NavbarItem,
} from "@sovoli/ui/components/navbar";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@sovoli/ui/components/dropdown";
import { Link } from "@sovoli/ui/components/link";
import { Button } from "@sovoli/ui/components/button";
import { ChevronDownIcon } from "lucide-react";

const menuItems = [
	{
		key: "overview",
		name: "Overview",
		href: "/business",
	},
	{
		key: "education",
		name: "Education",
		href: "/growth-system",
	},
	{
		key: "services",
		name: "Services",
		href: "/services",
	},
];

// Items shown inline on desktop (excluding overview since title links there)
const desktopNavItems = menuItems.filter((item) => item.key !== "overview");

export function BusinessSubnav() {
	const pathname = usePathname();

	return (
		<Navbar
			isBordered
			classNames={{
				wrapper: "max-w-6xl px-4",
			}}
		>
			{/* Mobile: Dropdown */}
			<NavbarContent className="sm:hidden">
				<Dropdown
					classNames={{
						content:
							"w-screen max-w-none rounded-none border-x-0 border-t border-divider shadow-md -ml-4",
					}}
				>
					<DropdownTrigger>
						<Button
							variant="light"
							size="lg"
							endContent={<ChevronDownIcon className="h-5 w-5" />}
							className="font-semibold text-lg"
						>
							Sovoli Business
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="Business navigation"
						itemClasses={{ title: "text-base", base: "pl-8 pr-4 py-3" }}
						className="gap-1 p-2"
					>
						{menuItems.map((item) => (
							<DropdownItem
								key={item.key}
								href={item.href}
								className={
									pathname === item.href ? "text-primary bg-primary/10" : ""
								}
							>
								{item.name}
							</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>

			{/* Desktop: Inline nav items */}
			<NavbarContent className="hidden sm:flex gap-6">
				<NavbarItem>
					<Link
						href="/business"
						className={`font-semibold text-lg ${
							pathname === "/business" ? "text-primary" : "text-foreground"
						}`}
					>
						Sovoli Business
					</Link>
				</NavbarItem>
				{desktopNavItems.map((item) => (
					<NavbarItem key={item.key}>
						<Link
							href={item.href}
							className={
								pathname === item.href ? "text-primary" : "text-foreground"
							}
						>
							{item.name}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>
		</Navbar>
	);
}
