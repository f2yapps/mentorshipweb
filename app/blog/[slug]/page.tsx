import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  await params;
  notFound();
}

export function generateStaticParams() {
  return [];
}
