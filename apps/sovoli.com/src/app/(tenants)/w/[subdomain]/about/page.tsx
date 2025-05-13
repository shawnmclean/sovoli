import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The Modern Academy private school",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      {" "}
      About Page{" "}
    </div>
  );
}
