export interface GraphPageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export default async function GraphPage(props: GraphPageProps) {
  const params = await props.params;
  return (
    <div>
      Graph Page: {params.username}/{params.slug}
    </div>
  );
}
