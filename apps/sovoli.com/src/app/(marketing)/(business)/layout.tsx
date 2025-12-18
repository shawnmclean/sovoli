import type { Metadata } from "next";
import { BusinessNavbar } from "./components/BusinessNavbar";
import { BusinessStickyFooter } from "./components/BusinessStickyFooter";

export const metadata: Metadata = {
  title: {
    default: "Sovoli Business – Digitize Your Organization",
    template: "%s | Sovoli Business",
  },
  description:
    "Websites, Google visibility, programs, services, products, and projects — all in one place. Digital solutions for Caribbean businesses.",
  openGraph: {
    title: "Sovoli Business – Digitize Your Organization",
    description:
      "Websites, Google visibility, programs, services, products, and projects — all in one place. Digital solutions for Caribbean businesses.",
    images: [{ url: "/images/og.webp" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sovoli Business – Digitize Your Organization",
    description:
      "Websites, Google visibility, programs, services, products, and projects — all in one place. Digital solutions for Caribbean businesses.",
    images: ["/images/og.webp"],
  },
};

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
