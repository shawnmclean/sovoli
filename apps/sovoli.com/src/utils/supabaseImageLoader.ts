import { env } from "../env";

export default function supabaseLoader({
  src,
  //   width,
  //   quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // if the src is a remote url, return it as is
  if (src.startsWith("http")) {
    return src;
  }
  // this is custom loader for supabase image transformations which we dont have until we upgrade to pro plan.
  //return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/${src}?width=${width}&quality=${quality ?? 75}`;
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${src}`;
}
