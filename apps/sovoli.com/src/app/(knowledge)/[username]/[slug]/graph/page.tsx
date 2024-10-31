export interface GraphPageProps {
  params: {
    username: string;
    slug: string;
  };
}

export default function GraphPage({ params }: GraphPageProps) {
  return (
    <div>
      Graph Page: {params.username}/{params.slug}
    </div>
  );
}
