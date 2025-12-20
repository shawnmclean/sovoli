"use client";

import { useProgramCycleSelection } from "../../context/ProgramCycleSelectionContext";
import { Button } from "@sovoli/ui/components/button";
import {
	DrawerContent,
	DrawerHeader as DrawerHeaderComponent,
	DrawerBody as DrawerBodyComponent,
} from "@sovoli/ui/components/drawer";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { MessageSquareShareIcon } from "lucide-react";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import { getWhatsAppContact } from "~/utils/whatsappUtils";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import { SubscribeProgramButton } from "../SubscribeProgramButton";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";
import { PricingContent } from "./PricingContent";

interface PriceDetailsProps {
	orgInstance: OrgInstance;
	program: Program;
	defaultCycle?: ProgramCycle;
	onChatNowClick?: () => void;
	hideFooter?: boolean;
}

export function PriceDetails({
	orgInstance,
	program,
	defaultCycle,
	onChatNowClick,
	hideFooter = false,
}: PriceDetailsProps) {
	const { selectedCycle } = useProgramCycleSelection();
	const {
		isOpen: isChatOpen,
		onOpen: onChatOpen,
		onOpenChange: onChatOpenChange,
	} = useDisclosure();

	const whatsappNumber = getWhatsAppContact(orgInstance);

	// Use selected cycle if available, otherwise fall back to default cycle
	const cycleToUse = selectedCycle ?? defaultCycle;

	if (!cycleToUse) {
		return null;
	}

	return (
		<>
			<DrawerContent>
				{(onClose) => (
					<>
						<DrawerHeaderComponent
							showBackButton
							onBackPress={onClose}
							endContent={
								<>
									<ShareButton
										title="Share"
										variant="light"
										text={`Check out ${program.name} pricing.`}
									/>
									<SubscribeProgramButton
										program={program}
										variant="light"
									/>
								</>
							}
						/>
						<DrawerBodyComponent>
							<PricingContent
								program={program}
								defaultCycle={defaultCycle}
							/>

							{/* Fixed Footer with Chat Now Button */}
							{!hideFooter && (
								<div className="fixed bottom-0 left-0 right-0 border-t border-divider p-4 z-50 bg-background/95 backdrop-blur-sm">
									<div className="max-w-4xl mx-auto">
										<Button
											fullWidth
											variant="shadow"
											color="primary"
											radius="full"
											size="lg"
											startContent={<MessageSquareShareIcon size={20} />}
											className={gradientBorderButton()}
											onPress={() => {
												if (onChatNowClick) {
													onClose();
													onChatNowClick();
												} else {
													onChatOpen();
												}
											}}
										>
											Chat Now
										</Button>
									</div>
								</div>
							)}
						</DrawerBodyComponent>
					</>
				)}
			</DrawerContent>

			{/* Chat Dialog */}
			<SignupDialog
				isOpen={isChatOpen}
				onOpenChange={onChatOpenChange}
				mode="lead"
				cycle={cycleToUse}
				program={program}
				whatsappNumber={whatsappNumber}
			/>
		</>
	);
}

