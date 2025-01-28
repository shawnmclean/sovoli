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
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="mt-6 flex flex-col items-center pb-6">
          {/* <AcmeIcon size={60} /> */}
          <p className="text-xl font-medium">Join the community</p>
          <p className="mt-1 text-center text-small text-default-500">
            Enter your email to be invited to the whatsapp group to help build
            and share knowledge.
          </p>
        </div>
        <SigninForm callbackUrl={callbackUrl} />
        <p className="text-center text-small text-default-500">
          The platform is currently in alpha. We will slowly invite new users
          who are in the whatsapp group.
        </p>
      </div>
    </div>
  );
}
