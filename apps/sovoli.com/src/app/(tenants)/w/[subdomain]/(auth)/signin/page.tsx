import { redirect } from "next/navigation";
import { Alert } from "@sovoli/ui/components/alert";

import { auth } from "~/core/auth";
import { SigninForm } from "./components/SigninForm";

type SearchParams = Promise<{ callbackUrl: string }>;

export interface SigninPageProps {
  searchParams: SearchParams;
}

export default async function SigninPage(props: SigninPageProps) {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl;

  return (
    <section className="flex justify-center px-4 pb-10 pt-12">
      <div className="w-full max-w-md">
        <Alert color="warning" className="mb-6">
          The platform is currently not activated.
        </Alert>

        <div className="mb-6 text-center">
          <p className="text-xl font-semibold">Sign In</p>
          <p className="mt-1 text-sm text-default-500">
            Enter your email to access the platform.
          </p>
        </div>

        <SigninForm callbackUrl={callbackUrl} />
      </div>
    </section>
  );
}
