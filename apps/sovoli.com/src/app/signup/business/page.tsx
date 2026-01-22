import type { Metadata } from "next";
import { isBusinessCategory } from "../../(marketing)/(business)/business/categories";
import { BusinessSignupWizard } from "./components/BusinessSignupWizard";

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
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <BusinessSignupWizard initialCategory={validCategory} />
      </main>
    </div>
  );
}
