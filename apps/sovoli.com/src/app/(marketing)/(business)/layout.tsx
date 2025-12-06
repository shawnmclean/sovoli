import { BusinessSubnav } from "./components/BusinessSubnav";

interface Props {
	children: React.ReactNode;
}

export default function BusinessLayout({ children }: Props) {
	return (
		<>
			<BusinessSubnav />
			{children}
		</>
	);
}
