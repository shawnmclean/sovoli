import { notFound } from "next/navigation";
import { getOrgInstanceByUsername } from "./lib/getOrgInstanceByUsername";

const retreiveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};
interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retreiveOrgInstance(username);

  return {
    metadataBase: new URL(website.url),
    title: {
      absolute: website.title,
      template: `%s | ${website.siteName}`,
    },
    description: website.description,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: website.title,
      description: website.description,
      url: "/",
      siteName: website.siteName,
      images: website.images,
    },
  };
}

export default function Layout({ children }: Props) {
  return <>{children}</>;
}
