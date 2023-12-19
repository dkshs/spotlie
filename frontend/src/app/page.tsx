import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="my-8 flex flex-col gap-8">
      <section className="px-9">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Musics</h2>
          <Button size="sm" radius="full" className="px-4" asChild>
            <Link href="/musics">
              <span className="text-sm font-bold uppercase">See more</span>
            </Link>
          </Button>
        </header>
        <div className="w-[calc(100% - 20px)] flex flex-1 snap-x snap-mandatory gap-8 overflow-x-auto px-1 pb-3"></div>
      </section>
      <section className="px-9">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Artists</h2>
          <Button size="sm" radius="full" className="px-4" asChild>
            <Link href="/artists">
              <span className="text-sm font-bold uppercase">See more</span>
            </Link>
          </Button>
        </header>
        <div className="w-[calc(100% - 20px)] flex flex-1 snap-x snap-mandatory gap-8 overflow-x-auto px-1 pb-3"></div>
      </section>
    </div>
  );
}
