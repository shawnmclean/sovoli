"use client";

import { useEffect, useState, useTransition } from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@sovoli/ui/components/navbar";
import { Link } from "@sovoli/ui/components/link";
import {
	Drawer,
	DrawerContent,
	DrawerBody,
	DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Button } from "@sovoli/ui/components/button";
import { Logo } from "~/components/Logo/Logo";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

const menuItems = [
	{ name: "Business", href: "/business" },
	{ name: "Pricing", href: "/pricing" },
];

export function MarketingNavbar() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const pathname = usePathname();
	const [, startTransition] = useTransition();

	useEffect(() => {
		if (pathname) {
			startTransition(() => {
				setIsDrawerOpen(false);
			});
		}
	}, [pathname]);

	return (
		<>
			<Navbar
				maxWidth="xl"
				className="bg-background/80 backdrop-blur-md"
				height="60px"
				position="static"
			>
				<NavbarContent>
					<Button
						isIconOnly
						variant="light"
						aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
						className="sm:hidden"
						onPress={() => setIsDrawerOpen(true)}
					>
						<MenuIcon size={24} />
					</Button>
					<NavbarBrand>
						<Link href="/" className="flex items-center gap-2">
							<Logo />
							<p className="font-bold text-inherit">Sovoli</p>
						</Link>
					</NavbarBrand>
				</NavbarContent>

				<NavbarContent className="hidden sm:flex gap-4" justify="center">
					{menuItems.map((item) => (
						<NavbarItem key={item.name}>
							<Link
								color="foreground"
								href={item.href}
								className="w-full"
								size="sm"
							>
								{item.name}
							</Link>
						</NavbarItem>
					))}
				</NavbarContent>

				<NavbarContent justify="end">
					<NavbarItem></NavbarItem>
				</NavbarContent>
			</Navbar>

			<Drawer
				isOpen={isDrawerOpen}
				onOpenChange={setIsDrawerOpen}
				placement="left"
				size="xs"
				hideCloseButton
			>
				<DrawerContent>
					<DrawerHeader
						startContent={
							<Link href="/" className="flex items-center gap-2">
								<Logo />
								<p className="font-bold text-inherit">Sovoli</p>
							</Link>
						}
						showBackButton
						onBackPress={() => setIsDrawerOpen(false)}
					/>
					<DrawerBody className="px-4 py-2">
						<nav className="flex flex-col gap-1">
							{menuItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									color="foreground"
									className="w-full px-4 py-3 rounded-lg hover:bg-default-100 transition-colors text-lg"
									size="lg"
								>
									{item.name}
								</Link>
							))}
						</nav>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
