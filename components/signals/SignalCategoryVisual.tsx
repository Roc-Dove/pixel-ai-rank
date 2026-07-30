import { Bot, Boxes, Code2, Cpu, PackageOpen, ShieldCheck } from "lucide-react";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import type { SignalCategory } from "@/types/signal";

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

function initials(company: string) {
  return company
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SignalCategoryVisual({
  category,
  company,
  date,
  sourceUrl,
}: {
  category: SignalCategory;
  company: string;
  date: string;
  sourceUrl: string;
}) {
  const Icon = CATEGORY_ICONS[category];
  const dateStamp = date.slice(5).replace("-", ".");

  return (
    <div className={`pixel-signal-category-visual tone-${CATEGORY_TONES[category]}`} aria-hidden="true">
      <span className="pixel-signal-category-icon">
        <LibraryLogo name={company} officialUrl={sourceUrl} />
        <Icon className="pixel-signal-category-badge" size={17} strokeWidth={1.8} />
      </span>
      <span className="pixel-signal-company-mark">{initials(company)}</span>
      <span className="pixel-signal-date-mark">{dateStamp}</span>
      <i />
      <i />
      <i />
    </div>
  );
}
