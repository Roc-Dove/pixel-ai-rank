import type { InputHTMLAttributes } from "react";

type PixelInputProps = InputHTMLAttributes<HTMLInputElement>;

export function PixelInput({ className, ...props }: PixelInputProps) {
  return (
    <div className={["pixel-search", className].filter(Boolean).join(" ")}>
      <input {...props} />
    </div>
  );
}
