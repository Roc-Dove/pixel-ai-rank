import Link from "next/link";
import { Bot, Boxes, Code2, Cpu, PackageOpen, ShieldCheck } from "lucide-react";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import { formatSignalImpact } from "@/lib/signals/utils";
import type { SignalCategory, SignalImpact } from "@/types/signal";
import styles from "./SignalCategoryVisual.module.css";

const CATEGORY_ICONS = {
  "模型升级": Cpu,
  Agent: Bot,
  "AI 编程": Code2,
  多模态: Boxes,
  产品变更: PackageOpen,
  安全与产业: ShieldCheck,
} satisfies Record<SignalCategory, typeof Cpu>;

const CATEGORY_TONES: Record<SignalCategory, string> = {
  "模型升级": "blue",
  Agent: "purple",
  "AI 编程": "green",
  多模态: "coral",
  产品变更: "yellow",
  安全与产业: "red",
};

export function SignalCategoryVisual({
  category,
  company,
  date,
  id,
  impact,
  sourceLabel,
  sourceUrl,
  title,
}: {
  category: SignalCategory;
  company: string;
  date: string;
  id: string;
  impact: SignalImpact;
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
        <span className={styles.impact}>{formatSignalImpact(impact)}</span>
      </div>
    </header>
  );
}
