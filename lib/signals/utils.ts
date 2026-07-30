import type { SignalItem } from "@/types/signal";

export function formatSignalDate(value: string) {
  const [, month, day] = value.split("-");
  return `${Number(month)} 月 ${Number(day)} 日`;
}

export type SignalLifecycle =
  | "due-today"
  | "open"
  | "ongoing"
  | "overdue"
  | "retired"
  | "upcoming";

export function getShanghaiDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function getSignalLifecycle(
  item: SignalItem,
  referenceDate = getShanghaiDate(),
): { status: SignalLifecycle; label: string } {
  if (item.deadline) {
    const comparison = item.deadline.localeCompare(referenceDate);

    if (comparison === 0) {
      return { status: "due-today", label: "今日截止" };
    }

    if (comparison > 0) {
      return { status: "upcoming", label: `截止 ${formatSignalDate(item.deadline)}` };
    }

    if (item.availability === "retired") {
      return { status: "retired", label: item.actionLabel ?? `已于 ${formatSignalDate(item.deadline)} 下线` };
    }

    return { status: "overdue", label: item.actionLabel ?? `已于 ${formatSignalDate(item.deadline)} 截止` };
  }

  if (item.availability === "open") {
    return { status: "open", label: item.actionLabel ?? "当前开放" };
  }

  if (item.availability === "retired") {
    return { status: "retired", label: item.actionLabel ?? "已经停用" };
  }

  return { status: "ongoing", label: item.actionLabel ?? "持续有效" };
}
