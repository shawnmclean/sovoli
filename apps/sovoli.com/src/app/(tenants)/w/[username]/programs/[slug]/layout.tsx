import { notFound } from "next/navigation";
import { Footer } from "../../components/footer/Footer";

import { ProgramDetailNavbar } from "./components/navbar/ProgramDetailMobileNavbar";
import { getOrgInstanceWithProgram } from "./lib/getOrgInstanceWithProgram";
import { Alert } from "@sovoli/ui/components/alert";

const retreiveOrgInstanceWithProgram = async (
  username: string,
  slug: string,
) => {
  const result = await getOrgInstanceWithProgram(username, slug);
  if (!result) return notFound();
  return result;
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username, slug } = await params;
  const {
    orgInstance: {
      websiteModule: { website },
    },
    program,
  } = await retreiveOrgInstanceWithProgram(username, slug);

  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";
  const programDescription =
    program.description ??
    program.standardProgramVersion?.program.description ??
    "";

  return {
    title: programName,
    description: programDescription,
    openGraph: {
      title: `${programName} | ${website.siteName}`,
      description: programDescription,
      type: "website",
      images: [
        {
          url:
            program.image ??
            program.standardProgramVersion?.program.image ??
            "",
          width: 1200,
          height: 630,
          alt: programName,
        },
      ],
    },
  };
}

export default async function Layout({ children, params }: Props) {
  const { username, slug } = await params;
  const { orgInstance, program } = await retreiveOrgInstanceWithProgram(
    username,
    slug,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <ProgramDetailNavbar orgInstance={orgInstance} program={program} />
      <Alert
        className="hidden md:flex"
        variant="flat"
        color="warning"
        title="Website optimized for mobile devices. Use your phone please."
      />
      {children}

      <Footer orgInstance={orgInstance} />
    </div>
  );
}
