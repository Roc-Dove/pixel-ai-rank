import type { ButtonHTMLAttributes } from "react";
import type { PixelTone } from "@/types/rank";

type PixelButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: PixelTone;
  active?: boolean;
};

export function pixelButtonClassName({ tone = "ghost", active = false }: { tone?: PixelTone; active?: boolean } = {}) {
  return ["pixel-btn", tone, active ? "is-active" : ""].filter(Boolean).join(" ");
}

export function PixelButton({ tone = "ghost", active = false, className, type = "button", ...props }: PixelButtonProps) {
  return <button type={type} className={[pixelButtonClassName({ tone, active }), className].filter(Boolean).join(" ")} {...props} />;
}
