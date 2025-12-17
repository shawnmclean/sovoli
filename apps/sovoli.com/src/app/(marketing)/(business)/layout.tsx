import { BusinessNavbar } from "./components/BusinessNavbar";
import { BusinessStickyFooter } from "./components/BusinessStickyFooter";

interface Props {
  children: React.ReactNode;
}

export default function BusinessLayout({ children }: Props) {
  return (
    <>
      <BusinessNavbar />
      {children}
      <BusinessStickyFooter />
    </>
  );
}
