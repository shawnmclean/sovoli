interface ServiceDetailsPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export default function ServiceDetailsPage({
  params: _params,
}: ServiceDetailsPageProps) {
  // Content is rendered in layout.tsx
  return null;
}
