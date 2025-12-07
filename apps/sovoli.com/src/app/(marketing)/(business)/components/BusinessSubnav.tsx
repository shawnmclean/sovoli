"use client";

import { usePathname } from "next/navigation";
import { Navbar, NavbarContent } from "@sovoli/ui/components/navbar";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@sovoli/ui/components/dropdown";
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

export function BusinessSubnav() {
	const pathname = usePathname();

	return (
		<Navbar
			isBordered
			height="3rem"
			classNames={{
				wrapper: "max-w-6xl px-4",
			}}
		>
			<NavbarContent>
				<Dropdown>
					<DropdownTrigger>
						<Button
							variant="light"
							endContent={<ChevronDownIcon className="h-4 w-4" />}
							className="font-semibold"
						>
							Sovoli Business
						</Button>
					</DropdownTrigger>
					<DropdownMenu aria-label="Business navigation">
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
		</Navbar>
	);
}
