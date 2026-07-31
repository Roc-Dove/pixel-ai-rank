import Link from "next/link";
import { Globe2, MapPin, Megaphone, PackageSearch } from "lucide-react";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import { formatSignalImpact } from "@/lib/signals/utils";
import type { SignalCategory, SignalImpact } from "@/types/signal";
import styles from "./SignalCategoryVisual.module.css";

const CATEGORY_ICONS = {
  产品: PackageSearch,
  KOL: Megaphone,
  出海: Globe2,
} satisfies Record<SignalCategory, typeof Globe2>;

const CATEGORY_TONES: Record<SignalCategory, string> = {
  产品: "blue",
  KOL: "purple",
  出海: "green",
};

export function SignalCategoryVisual({
  category,
  company,
  date,
  id,
  impact,
  market,
  sourceLabel,
  sourceUrl,
  title,
}: {
  category: SignalCategory;
  company: string;
  date: string;
  id: string;
  impact: SignalImpact;
  market: string;
  sourceLabel: string;
  sourceUrl: string;
  title: string;
}) {
  const Icon = CATEGORY_ICONS[category];
  const [year, month, day] = date.split("-");

  return (
    <header className={`${styles.cover} ${styles[CATEGORY_TONES[category]]}`}>
      <div className={styles.brand}>
        <span className={styles.logo}>
          <LibraryLogo name={company} officialUrl={sourceUrl} />
        </span>
        <span className={styles.brandCopy}>
          <strong>{company}</strong>
          <span>{sourceLabel}</span>
        </span>
      </div>

      <time className={styles.date} dateTime={date}>
        <strong>{month}.{day}</strong>
        <span>{year}</span>
      </time>

      <h2 className={styles.title}>
        <Link href={`/signals/${id}`} prefetch={false}>{title}</Link>
      </h2>

      <div className={styles.footer}>
        <span className={styles.category}><Icon size={16} strokeWidth={1.8} aria-hidden="true" /> {category}</span>
        <span className={styles.market}><MapPin size={14} strokeWidth={1.8} aria-hidden="true" /> {market}</span>
        <span className={styles.impact}>{formatSignalImpact(impact)}</span>
      </div>
    </header>
  );
}
