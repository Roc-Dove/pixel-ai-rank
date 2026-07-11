export function LoadingSprite({ label = "正在整理 AI 信号" }: { label?: string }) {
  return (
    <div className="pixel-loader" role="status" aria-live="polite">
      <span className="pixel-loader-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="pixel-loader-text">{label}</span>
    </div>
  );
}
