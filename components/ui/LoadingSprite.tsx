export function LoadingSprite({ label = "LOADING..." }: { label?: string }) {
  return (
    <div className="pixel-loader">
      <div className="pixel-loader-runner" aria-hidden="true">
        🏃
      </div>
      <div className="pixel-loader-text">{label}</div>
    </div>
  );
}
