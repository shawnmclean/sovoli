import { BusinessSubnav } from "./components/BusinessSubnav";
import { BusinessStickyFooter } from "./components/BusinessStickyFooter";

interface Props {
	children: React.ReactNode;
}

export default function BusinessLayout({ children }: Props) {
	return (
		<>
			<BusinessSubnav />
			{children}
			<BusinessStickyFooter />
		</>
	);
}
