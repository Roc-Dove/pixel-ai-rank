import { LoadingSprite } from "@/components/ui/LoadingSprite";

export default function LoadingRankPage() {
  return (
    <main id="main-content" className="flex min-h-[50vh] items-center justify-center px-4" tabIndex={-1}>
      <LoadingSprite />
    </main>
  );
}
