import { redirect } from "next/navigation";

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
    <div className="mx-auto max-w-7xl p-4">
      <h1>Sign in</h1>

      <SigninForm callbackUrl={callbackUrl} />
    </div>
  );
}
