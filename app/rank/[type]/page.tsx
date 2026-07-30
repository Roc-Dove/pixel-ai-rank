import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RankExplorer } from "@/components/rank/RankExplorer";
import { getRankPayload } from "@/lib/rank-data";
import { isRankRouteType, RANK_TYPES, TAB_CONFIG } from "@/types/rank";

export const revalidate = 3600;

export async function generateStaticParams() {
  return RANK_TYPES.map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  if (!isRankRouteType(type)) {
    return { title: "榜单不存在" };
  }

  return {
    title: TAB_CONFIG[type].label,
    description: TAB_CONFIG[type].summary,
    alternates: {
      canonical: `/rank/${type}`,
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      title: TAB_CONFIG[type].label,
      description: TAB_CONFIG[type].summary,
      url: `/rank/${type}`,
      type: "website",
    },
  };
}

export default async function RankTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isRankRouteType(type)) {
    notFound();
  }

  const payload = await getRankPayload(type);
  return <RankExplorer payload={payload} />;
}
