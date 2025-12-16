import type { Metadata } from "next";
import { BusinessSignupWizard } from "./components/BusinessSignupWizard";
import { isBusinessCategory } from "../../(marketing)/(business)/business/categories";

export const metadata: Metadata = {
  title: "Sign Up for Sovoli",
  description: "Sign up for Sovoli to grow your business.",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function SignupBusinessPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const validCategory =
    category && isBusinessCategory(category) ? category : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-white via-white to-gray-50">
      <main className="flex-1">
        <BusinessSignupWizard initialCategory={validCategory} />
      </main>
    </div>
  );
}
